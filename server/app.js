import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import Contact from './models/Contact.js';

const app = express();
const inMemoryMessages = [];
const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;
const jwtSecret = process.env.JWT_SECRET;

app.use(cors());
app.use(express.json({ limit: '20kb' }));

function requireAdmin(req, res, next) {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, '');
  if (!token) return res.status(401).json({ error: 'Authentication required.' });
  try {
    req.admin = jwt.verify(token, jwtSecret);
    return next();
  } catch {
    return res.status(401).json({ error: 'Your session has expired. Please sign in again.' });
  }
}

if (process.env.MONGODB_URI && mongoose.connection.readyState === 0) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB.'))
    .catch((error) => console.error('MongoDB connection failed:', error.message));
} else if (!process.env.MONGODB_URI) {
  console.warn('MONGODB_URI is not set. Contact messages are retained only while the server runs.');
}

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body || {};
  if (!name?.trim() || !email?.includes('@') || !message?.trim()) {
    return res.status(400).json({ error: 'Please provide a name, email, and message.' });
  }
  try {
    const payload = { name: name.trim(), email: email.trim(), message: message.trim() };
    if (mongoose.connection.readyState === 1) await Contact.create(payload);
    else inMemoryMessages.push({ ...payload, createdAt: new Date().toISOString() });
    return res.status(201).json({ message: 'Message received.' });
  } catch {
    return res.status(500).json({ error: 'Unable to save message.' });
  }
});

app.post('/api/admin/login', (req, res) => {
  if (!adminEmail || !adminPassword || !jwtSecret) {
    return res.status(503).json({ error: 'Admin access is not configured.' });
  }
  const { email, password } = req.body || {};
  if (email !== adminEmail || password !== adminPassword) {
    return res.status(401).json({ error: 'Incorrect email or password.' });
  }
  const token = jwt.sign({ role: 'admin', email: adminEmail }, jwtSecret, { expiresIn: '8h' });
  return res.json({ token });
});

app.get('/api/admin/contacts', requireAdmin, async (_req, res) => {
  try {
    const contacts = mongoose.connection.readyState === 1
      ? await Contact.find().sort({ createdAt: -1 }).lean()
      : [...inMemoryMessages].reverse();
    return res.json({ contacts, database: mongoose.connection.readyState === 1 ? 'mongodb' : 'memory' });
  } catch {
    return res.status(500).json({ error: 'Unable to load contact messages.' });
  }
});

app.patch('/api/admin/contacts/:id/read', requireAdmin, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true }).lean();
    if (!contact) return res.status(404).json({ error: 'Message not found.' });
    return res.json({ contact });
  } catch {
    return res.status(400).json({ error: 'Unable to mark this message as read.' });
  }
});

app.delete('/api/admin/contacts/:id', requireAdmin, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id).lean();
    if (!contact) return res.status(404).json({ error: 'Message not found.' });
    return res.json({ message: 'Message deleted.' });
  } catch {
    return res.status(400).json({ error: 'Unable to delete this message.' });
  }
});

app.get('/api/health', (_req, res) => res.json({ status: 'ok', database: mongoose.connection.readyState === 1 ? 'mongodb' : 'memory' }));

export default app;

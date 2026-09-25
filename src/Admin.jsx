import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { ArrowLeft, Check, LogOut, Mail, RefreshCw, ShieldCheck, Trash2, UserRound } from 'lucide-react';

const tokenKey = 'rohit-admin-token';

function Admin() {
  const [token, setToken] = useState(() => localStorage.getItem(tokenKey) || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [contacts, setContacts] = useState([]);
  const [database, setDatabase] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const smoothCursorX = useSpring(cursorX, { damping: 24, stiffness: 420, mass: 0.35 });
  const smoothCursorY = useSpring(cursorY, { damping: 24, stiffness: 420, mass: 0.35 });

  useEffect(() => {
    const moveCursor = (event) => {
      cursorX.set(event.clientX);
      cursorY.set(event.clientY);
    };
    window.addEventListener('pointermove', moveCursor);
    return () => window.removeEventListener('pointermove', moveCursor);
  }, [cursorX, cursorY]);

  const loadContacts = async (currentToken = token) => {
    if (!currentToken) return;
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/admin/contacts', { headers: { Authorization: `Bearer ${currentToken}` } });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to load messages.');
      setContacts(data.contacts);
      setDatabase(data.database);
    } catch (requestError) {
      setError(requestError.message);
      if (requestError.message.includes('session')) signOut();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadContacts(); }, []);

  const signIn = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to sign in.');
      localStorage.setItem(tokenKey, data.token);
      setToken(data.token);
      setPassword('');
      await loadContacts(data.token);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    localStorage.removeItem(tokenKey);
    setToken('');
    setContacts([]);
  };

  const updateMessage = async (contact, action) => {
    setError('');
    try {
      const response = await fetch(`/api/admin/contacts/${contact._id}${action === 'read' ? '/read' : ''}`, {
        method: action === 'read' ? 'PATCH' : 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to update message.');
      setContacts((current) => action === 'read'
        ? current.map((item) => item._id === contact._id ? data.contact : item)
        : current.filter((item) => item._id !== contact._id));
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const deleteMessage = (contact) => {
    if (window.confirm(`Delete the message from ${contact.name}? This cannot be undone.`)) updateMessage(contact, 'delete');
  };

  const cursor = <motion.div className="site-cursor is-admin" style={{ x: smoothCursorX, y: smoothCursorY }} aria-hidden="true" />;

  if (!token) {
    return <main className="admin-page">{cursor}<section className="login-panel"><a className="admin-back" href="/"><ArrowLeft size={16} /> Portfolio</a><ShieldCheck size={33} /><p className="eyebrow">Private access</p><h1>Admin sign in</h1><p>Manage incoming portfolio messages.</p><form onSubmit={signIn}><label>Email<input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></label><label>Password<input type="password" required value={password} onChange={(event) => setPassword(event.target.value)} /></label><button className="admin-button" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button>{error && <p className="admin-error">{error}</p>}</form></section></main>;
  }

  return <main className="admin-page">{cursor}<header className="admin-header"><a className="brand" href="/">RK<span>.</span></a><div><span className={`database-state ${database}`}>{database === 'mongodb' ? 'MongoDB connected' : 'Temporary memory'}</span><button className="icon-button" onClick={() => loadContacts()} title="Refresh messages" aria-label="Refresh messages"><RefreshCw size={17} /></button><button className="icon-button" onClick={signOut} title="Sign out" aria-label="Sign out"><LogOut size={17} /></button></div></header><section className="admin-dashboard"><div className="admin-title"><div><p className="eyebrow">Admin dashboard</p><h1>Messages <span>{contacts.length}</span></h1></div><button className="admin-button" onClick={() => loadContacts()} disabled={loading}><RefreshCw size={16} /> Refresh</button></div>{error && <p className="admin-error">{error}</p>}{loading ? <p className="admin-empty">Loading messages...</p> : contacts.length === 0 ? <p className="admin-empty">No messages yet. New contact-form submissions will appear here.</p> : <div className="message-list">{contacts.map((contact) => <article className={`message-card ${contact.isRead ? 'is-read' : 'is-unread'}`} key={contact._id || `${contact.email}-${contact.createdAt}`}><div className="message-meta"><span><UserRound size={15} /> {contact.name}{!contact.isRead && <b>New</b>}</span><span>{new Date(contact.createdAt).toLocaleString()}</span></div><a href={`mailto:${contact.email}`}><Mail size={15} /> {contact.email}</a><p>{contact.message}</p><div className="message-actions"><button className="message-action" disabled={contact.isRead} onClick={() => updateMessage(contact, 'read')} title="Mark as read" aria-label="Mark as read"><Check size={16} /> {contact.isRead ? 'Read' : 'Mark read'}</button><button className="message-action delete-action" onClick={() => deleteMessage(contact)} title="Delete message" aria-label="Delete message"><Trash2 size={16} /> Delete</button></div></article>)}</div>}</section></main>;
}

export default Admin;

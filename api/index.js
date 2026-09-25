import app from '../server/app.js';

export default function handler(req, res) {
  const requestUrl = new URL(req.url, 'http://localhost');
  const path = requestUrl.searchParams.get('path');

  if (path) {
    requestUrl.searchParams.delete('path');
    const query = requestUrl.searchParams.toString();
    req.url = `/api/${path}${query ? `?${query}` : ''}`;
  }

  return app(req, res);
}

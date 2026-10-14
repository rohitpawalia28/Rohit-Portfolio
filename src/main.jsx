import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// The public portfolio and the admin dashboard ship separate stylesheets,
// so each route only loads the CSS it needs.
const isAdmin = window.location.pathname === '/admin';

const load = isAdmin
  ? Promise.all([import('./Admin'), import('./admin.css')])
  : Promise.all([import('./App'), import('./styles.css')]);

load.then(([{ default: Page }]) => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <Page />
    </StrictMode>,
  );
});

import { Link } from 'react-router';
import './PageNotFound.css';

export const PageNotFound = () => (
  <main id="main-content" tabIndex={-1} className="not-found-page">
    <h1>Page not found</h1>
    <p>The page you’re looking for may have moved or does not exist.</p>
    <Link to="/">Return to Christ Alive Power Assembly</Link>
  </main>
);

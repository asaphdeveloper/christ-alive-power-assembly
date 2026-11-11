import { useState } from 'react';
import { useAuthBackground } from '../../hooks/useAuthBackground';
import { Link } from 'react-router';
import ChurchLogo from '../../assets/images/logo.webp';
import './ForgotPasswordPage.css';

export const ForgotPasswordPage = () => {
  const canvasRef = useAuthBackground();

  const [formMessage, setFormMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    setFormMessage('If an account exists for this email, a reset link is on its way.');
  };

  return (
    <main id="main-content" tabIndex={-1} className="forgot-password-page">
      <section className="auth-panel" aria-label="Welcome to Christ Alive Power Assembly">
        <canvas ref={canvasRef} className="auth-panel-canvas" aria-hidden="true" />
        <Link to="/" className="auth-brand">
          <img decoding="async" className="auth-logo" src={ChurchLogo} alt="" width="48" height="48" />
          <span>Christ Alive Power Assembly</span>
        </Link>
        <div className="auth-panel-hero">
          <h1>Christ Alive<br />Power Assembly</h1>
          <p>One account keeps your groups, giving and service schedule in a single place.</p>
          <Link to="/" className="auth-home-link">Back to website</Link>
        </div>
        <p className="auth-panel-foot">PHIL 3:10 <span>THAT I MAY KNOW HIM...</span></p>
      </section>
      <section className="form-panel" aria-labelledby="form-title">
        <div className="form-wrap">
          <div className="form-heading">
            <p className="eyebrow">Account recovery</p>
            <h2 id="form-title">Reset your password.</h2>
            <p>Enter your email and we will send you a secure reset link.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email address<input id="email" name="email" type="email" placeholder="you@example.com" autoComplete="email" required /></label>
            <button className="submit-button" type="submit">Send reset link <span aria-hidden="true">↗</span></button>
          </form>

          {formMessage && <p className="form-message" role="status">{formMessage}</p>}

          <p className="form-note"><Link to="/login">Back to log in</Link></p>
        </div>
      </section>
    </main>
  );
};

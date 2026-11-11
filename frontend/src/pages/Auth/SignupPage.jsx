import { useState } from 'react';
import { useAuthBackground } from '../../hooks/useAuthBackground';
import { Link } from 'react-router';
import ChurchLogo from '../../assets/images/logo.webp';
import './SignupPage.css';

export const SignupPage = () => {
  const canvasRef = useAuthBackground();

  const [showPassword, setShowPassword] = useState(false);
  const [formMessage, setFormMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    setFormMessage('Thanks. Your details have been received.');
  };

  return (
    <main id="main-content" tabIndex={-1} className="signup-page">
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
            <p className="eyebrow">Welcome back</p>
            <h2 id="form-title">Start your journey.</h2>
            <p>Create your account and find your place.</p>
          </div>

          <div className="mode-switch" aria-label="Authentication mode">
            <Link to="/login">Log in</Link>
            <Link className="active" to="/signup">Sign up</Link>
          </div>

          <form onSubmit={handleSubmit}>
            <label htmlFor="full-name">Full name<input id="full-name" name="fullName" type="text" placeholder="Alex Morgan" autoComplete="name" required /></label>
            <label htmlFor="email">Email address<input id="email" name="email" type="email" placeholder="you@example.com" autoComplete="email" required /></label>
            <label htmlFor="password">Password<span className="password-field">
              <input id="password" name="password" type={showPassword ? 'text' : 'password'} placeholder="Enter your password" autoComplete="new-password" required />
              <button
                className="password-toggle"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >{showPassword ? 'Hide' : 'Show'}</button>
            </span></label>
            <label className="check-label" htmlFor="terms"><input id="terms" name="terms" type="checkbox" required /><span>I agree to the <a href="#terms">terms of use</a>.</span></label>
            <button className="submit-button" type="submit">Create account <span aria-hidden="true">↗</span></button>
          </form>

          {formMessage && <p className="form-message" role="status">{formMessage}</p>}

          <p className="form-note"><Link to="/forgot-password">Forgot password?</Link></p>
        </div>
      </section>
    </main>
  );
};

import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import Logo from '../../assets/images/capa-logo.png'
import './AuthPage.css';

export const AuthPage = () => {
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const isSignup = location.pathname === '/signup';
  const isReset = location.pathname === '/forgot-password';
  const [formMessage, setFormMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    // const data = Object.fromEntries(formData.entries());
    console.log(formData);

    setFormMessage(isReset
      ? 'If an account exists for this email, a reset link is on its way.'
      : 'Thanks. Your details have been received.'
    );
  };

  return (
    <main className="auth-page auth-shell">
      <section className="visual-panel" aria-label="Christ Alive Power Assembly introduction">
        <Link to="/" className="visual-topbar">
          <img src={Logo} className="logo" alt="logo image" />
          <span className="brand-name">Christ Alive Power Assembly</span>
        </Link>

        <div className="church-scene" aria-hidden="true">
          <div className="church-halo" />
          <div className="church-rays church-rays-left" />
          <div className="church-rays church-rays-right" />
          <div className="church-arch">
            <div className="church-cross"><span /></div>
          </div>
          <div className="church-ground" />
        </div>

        <div className="visual-copy">
          <p className="eyebrow">A place to belong</p>
          <h1 id="page-title">Christ Alive <br /><span>Power Assembly.</span></h1>
          <p className="visual-description">
            Stay connected to the people, purpose, and faith community moving us forward together.
          </p>
        </div>

        <div className="visual-footer">
          <span>PHIL 3:10</span>
          <span className="footer-line" />
          <span>THAT I MAY KNOW HIM...</span>
        </div>
      </section>

      <section className="form-panel" aria-labelledby="form-title">
        <div className="form-wrap">
          <div className="mobile-brand">
            <span className="brand-mark">C</span> CAPA / 01
          </div>

          <div className="form-heading">
            <p className="eyebrow">{isReset ? 'Account recovery' : 'Welcome back'}</p>
            <h2 id="form-title">{isReset ? 'Reset your password.' : isSignup ? 'Start your journey.' : 'Good to see you.'}</h2>
            <p>{isReset ? 'Enter your email and we will send you a secure reset link.' : isSignup ? 'Create your account and find your place.' : 'Enter your details to continue where you left off.'}</p>
          </div>

          {!isReset && <div className="mode-switch" aria-label="Authentication mode">
            <Link className={!isSignup ? 'active' : ''} to="/login">Log in</Link>
            <Link className={isSignup ? 'active' : ''} to="/signup">Sign up</Link>
          </div>}

          <form onSubmit={handleSubmit}>
            {isSignup && <label htmlFor="full-name">Full name<input id="full-name" name="fullName" type="text" placeholder="Alex Morgan" autoComplete="name" required /></label>}
            <label htmlFor="email">Email address<input id="email" name="email" type="email" placeholder="you@example.com" autoComplete="email" required /></label>
            {!isReset && <label htmlFor="password">Password<span className="password-field">
              <input id="password" name="password" type={showPassword ? 'text' : 'password'} placeholder="Enter your password" autoComplete={isSignup ? 'new-password' : 'current-password'} required />
              <button
                className="password-toggle"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >{showPassword ? 'Hide' : 'Show'}</button>
            </span></label>}
            {isSignup && <label className="check-label" htmlFor="terms"><input id="terms" name="terms" type="checkbox" required /><span>I agree to the <a href="#terms">terms of use</a>.</span></label>}
            {!isSignup && !isReset && <Link className="forgot-link" to="/forgot-password">Forgot password?</Link>}
            <button className="submit-button" type="submit">{isReset ? 'Send reset link' : isSignup ? 'Create account' : 'Continue'} <span aria-hidden="true">↗</span></button>
          </form>

          {formMessage && <p className="form-message" role="status">{formMessage}</p>}

          <p className="form-note">
            {isReset ? <Link to="/login">Back to log in</Link> : isSignup ? <Link to="/forgot-password">Forgot password?</Link> : <Link to="/forgot-password">Forgot password? Click to reset</Link>}
          </p>
        </div>
        <span className="corner-number">01 / 02</span>
      </section>
    </main>
  );
};
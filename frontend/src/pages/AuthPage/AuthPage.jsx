import { useState } from 'react';
import { Link } from 'react-router';
import Logo from '../../assets/images/capa-logo.png'
import './AuthPage.css';

export const AuthPage = ({ initialMode = 'login' }) => {
  const [mode, setMode] = useState(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const isSignup = mode === 'signup';
  const isReset = mode === 'reset';

  return (
    <main className="auth-page auth-shell">
      <section className="visual-panel" aria-label="Christ Alive Power Assembly introduction">
        <div className="visual-topbar">
          <img src={Logo} className="logo" alt="logo image" />
          <span className="brand-name">Christ Alive Power Assembly</span>
        </div>

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
          <h1 id="page-title">Christ Alive  <br /><span>Power Assembly.</span></h1>
          <p className="visual-description">
            Stay connected to the people, purpose, and faith community moving us forward together.
          </p>
        </div>

        <div className="visual-footer">
          <span>EST. 2008</span>
          <span className="footer-line" />
          <span>ALIVE IN CHRIST</span>
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
            <button className={!isSignup ? 'active' : ''} type="button" onClick={() => setMode('login')}>Log in</button>
            <button className={isSignup ? 'active' : ''} type="button" onClick={() => setMode('signup')}>Sign up</button>
          </div>}

          <form onSubmit={(event) => event.preventDefault()}>
            {isSignup && <label>Full name<input type="text" placeholder="Alex Morgan" required /></label>}
            <label>Email address<input type="email" placeholder="you@example.com" required /></label>
            {!isReset && <label>Password<span className="password-field">
              <input type={showPassword ? 'text' : 'password'} placeholder="Enter your password" required />
              <button
                className="password-toggle"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >{showPassword ? 'Hide' : 'Show'}</button>
            </span></label>}
            {isSignup && <label className="check-label"><input type="checkbox" required /><span>I agree to the <a href="#terms">terms of use</a>.</span></label>}
            {!isSignup && !isReset && <Link className="forgot-link" to="/forgot-password">Forgot password?</Link>}
            <button className="submit-button" type="submit">{isReset ? 'Send reset link' : isSignup ? 'Create account' : 'Continue'} <span aria-hidden="true">↗</span></button>
          </form>

          <p className="form-note">
            {isReset ? <Link to="/auth">Back to log in</Link> : isSignup ? <Link to="/forgot-password">Forgot password?</Link> : <Link to="/forgot-password">Forgot/reset password</Link>}
          </p>
        </div>
        <span className="corner-number">01 / 02</span>
      </section>
    </main>
  );
};
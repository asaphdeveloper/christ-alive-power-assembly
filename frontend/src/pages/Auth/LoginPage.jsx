import { useState } from 'react';
import { Link } from 'react-router';
import { AuthLayout } from './AuthLayout';
import './LoginPage.css';

export const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formMessage, setFormMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    console.log(formData);
    setFormMessage('Thanks. Your details have been received.');
  };

  return (
    <AuthLayout className="login-page">
      <div className="form-heading">
        <p className="eyebrow">Welcome back</p>
        <h2 id="form-title">Good to see you.</h2>
        <p>Enter your details to continue where you left off.</p>
      </div>

      <div className="mode-switch" aria-label="Authentication mode">
        <Link className="active" to="/login">Log in</Link>
        <Link to="/signup">Sign up</Link>
      </div>

      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email address<input id="email" name="email" type="email" placeholder="you@example.com" autoComplete="email" required /></label>
            <label htmlFor="password">Password<span className="password-field">
              <input id="password" name="password" type={showPassword ? 'text' : 'password'} placeholder="Enter your password" autoComplete="current-password" required />
              <button
                className="password-toggle"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >{showPassword ? 'Hide' : 'Show'}</button>
            </span></label>
        <Link className="forgot-link" to="/forgot-password">Forgot password?</Link>
        <button className="submit-button" type="submit">Continue <span aria-hidden="true">↗</span></button>
      </form>

      {formMessage && <p className="form-message" role="status">{formMessage}</p>}

      <p className="form-note"><Link to="/forgot-password">Forgot password? Click to reset</Link></p>
    </AuthLayout>
  );
};

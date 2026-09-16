import { useState } from 'react';
import { Link } from 'react-router';
import { AuthLayout } from './AuthLayout';
import ChurchImage from '../../assets/images/slide-03.jpg';
import './SignupPage.css';

export const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formMessage, setFormMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    console.log(formData);
    setFormMessage('Thanks. Your details have been received.');
  };

  return (
    <AuthLayout image={ChurchImage} className="signup-page">
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
    </AuthLayout>
  );
};

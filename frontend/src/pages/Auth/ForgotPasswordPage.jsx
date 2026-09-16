import { useState } from 'react';
import { Link } from 'react-router';
import { AuthLayout } from './AuthLayout';
import './ForgotPasswordPage.css';

export const ForgotPasswordPage = () => {
  const [formMessage, setFormMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    console.log(formData);
    setFormMessage('If an account exists for this email, a reset link is on its way.');
  };

  return (
    <AuthLayout className="forgot-password-page">
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
    </AuthLayout>
  );
};

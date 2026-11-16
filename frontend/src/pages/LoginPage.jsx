import { useEffect, useRef, useState } from 'react';
import { CircleAlert, Eye, EyeOff, LockKeyhole, UserRound } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router';
import { adminLandingRoutes } from '../auth/authRoutes';
import { useAuth } from '../auth/useAuth';
import { LoadingSpinner } from '../components/LoadingSpinner';
import logo from '../assets/images/logo.webp';
import './LoginPage.css';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { admin, isLoading: isCheckingSession, signIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState(location.state?.message || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submittedLogin = useRef(false);
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });

  useEffect(() => {
    if (!submittedLogin.current && !isCheckingSession && admin) {
      navigate(adminLandingRoutes[admin.role] || '/admin/developer/overview', { replace: true });
    }
  }, [admin, isCheckingSession, navigate]);

  function handleChange(event) {
    const { name, value } = event.target;
    setCredentials((current) => ({ ...current, [name]: value }));
    if (message) setMessage('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!credentials.username.trim() && !credentials.password) {
      setMessage('Enter your username and password.');
      return;
    }
    if (!credentials.username.trim()) {
      setMessage('Enter your username.');
      return;
    }
    if (!credentials.password) {
      setMessage('Enter your password.');
      return;
    }
    setIsSubmitting(true);
    submittedLogin.current = true;
    try {
      const signedInAdmin = await signIn(credentials);
      navigate(
        adminLandingRoutes[signedInAdmin.role] || '/admin/developer/overview',
        { replace: true },
      );
    } catch (error) {
      setMessage(error instanceof TypeError
        ? 'Could not connect to the sign-in service. Check your connection and try again.'
        : error.message || 'Unable to sign in.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className='login-page' id='main-content'>
      <a
        className='login-brand'
        href='/'
        aria-label='Christ Alive Power Assembly home'
      >
        <img src={logo} alt='Christ Alive Power Assembly' />
      </a>

      <section className='login-card' aria-labelledby='login-title'>
        <div className='login-logo-wrap'>
          <img src={logo} alt='' />
        </div>
        <h1 id='login-title'>Welcome back</h1>
        <p className='login-intro'>Sign in to continue to your account</p>

        <form className='login-form' onSubmit={handleSubmit}>
          <label className='login-field'>
            <span>Username</span>
            <span className='login-input-wrap'>
              <UserRound size={18} aria-hidden='true' />
              <input
                name='username'
                type='text'
                value={credentials.username}
                onChange={handleChange}
                autoComplete='username'
                placeholder='Enter your username'
              />
            </span>
          </label>

          <label className='login-field'>
            <span>Password</span>
            <span className='login-input-wrap'>
              <LockKeyhole size={18} aria-hidden='true' />
              <input
                name='password'
                type={showPassword ? 'text' : 'password'}
                value={credentials.password}
                onChange={handleChange}
                autoComplete='current-password'
                placeholder='Enter your password'
              />
              <button
                className='login-password-toggle'
                type='button'
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </span>
          </label>

          {message && (
            <p className='login-message' role='alert' aria-live='assertive'>
              <CircleAlert size={15} aria-hidden='true' />
              <span>{message}</span>
            </p>
          )}
          <button className='login-submit' type='submit' disabled={isSubmitting} aria-busy={isSubmitting}>
            {isSubmitting ? <><LoadingSpinner /> Signing in…</> : 'Sign in'}
          </button>
        </form>
        <a className='login-home-link' href='/'>
          Back to home
        </a>
      </section>

      <footer className='login-footer'>
        <span>Christ Alive Power Assembly</span>
        <span>Faith · Love · Service</span>
      </footer>
    </main>
  );
}

import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import ChurchLogo from '../../assets/images/capa-logo.png';
import './SignupPage.css';

export const SignupPage = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!context) return undefined;

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let particles = [];
    let width = 0;
    let height = 0;
    let frame;
    let previousTime = 0;

    const draw = (time) => {
      const step = previousTime ? Math.min((time - previousTime) / 16.67, 3) : 0;
      previousTime = time;
      context.clearRect(0, 0, width, height);
      const breath = motion.matches ? 0.5 : 0.5 + 0.5 * Math.sin(time / 2800);
      const crossX = width * 0.82;
      const crossY = height * 0.35;
      const crossSize = Math.min(width * 0.16, 90);
      const elapsed = motion.matches ? 0 : time / 1000;

      // Broad, translucent rays keep the light behind the content.
      context.save();
      context.globalCompositeOperation = 'screen';
      for (let ray = 0; ray < 4; ray += 1) {
        const origin = width * (0.55 + ray * 0.15);
        const sway = Math.sin(elapsed / 6 + ray * 1.7) * width * 0.09;
        const light = context.createLinearGradient(origin, 0, origin - width * 0.3, height);
        light.addColorStop(0, 'rgba(234, 219, 167, 0)');
        light.addColorStop(0.15, `rgba(234, 219, 167, ${0.04 + breath * 0.025})`);
        light.addColorStop(1, 'rgba(234, 219, 167, 0)');
        context.fillStyle = light;
        context.beginPath();
        context.moveTo(origin, -20);
        context.lineTo(origin + width * 0.035, -20);
        context.lineTo(origin - width * 0.18 + sway, height);
        context.lineTo(origin - width * 0.5 + sway, height);
        context.closePath();
        context.fill();
      }
      context.restore();

      context.save();
      context.strokeStyle = `rgba(234, 219, 167, ${0.22 + breath * 0.1})`;
      context.lineWidth = 1.5;
      context.shadowColor = '#eadba7';
      context.shadowBlur = 28 + breath * 18;
      context.beginPath();
      context.moveTo(crossX, crossY - crossSize);
      context.lineTo(crossX, crossY + crossSize * 1.6);
      context.moveTo(crossX - crossSize * 0.65, crossY);
      context.lineTo(crossX + crossSize * 0.65, crossY);
      context.stroke();
      context.lineWidth = 7;
      context.globalAlpha = 0.12;
      context.stroke();
      context.restore();

      particles.forEach((particle) => {
        if (!motion.matches) {
          particle.y -= particle.speed * step;
          particle.x += Math.sin(time / 1600 + particle.phase) * 0.22 * step;
          if (particle.x < -4) particle.x = width + 4;
          if (particle.x > width + 4) particle.x = -4;
          if (particle.y < -4) particle.y = height + 4;
        }
        const opacity = particle.opacity * (motion.matches ? 1 : 0.7 + 0.3 * Math.sin(time / 1500 + particle.phase));
        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(234, 219, 167, ${opacity})`;
        context.shadowColor = 'rgba(234, 219, 167, 0.5)';
        context.shadowBlur = particle.radius > 1 ? 6 : 0;
        context.fill();
        context.shadowBlur = 0;
      });
      if (!motion.matches) frame = requestAnimationFrame(draw);
    };

    const resize = () => {
      cancelAnimationFrame(frame);
      const bounds = canvas.parentElement.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = bounds.width;
      height = bounds.height;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      particles = Array.from({ length: Math.min(85, Math.max(36, Math.floor(width * height / 12000))) }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 0.4 + Math.random() * 1.2,
        opacity: 0.12 + Math.random() * 0.3,
        speed: 0.3 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
      }));
      previousTime = 0;
      draw(performance.now());
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas.parentElement);
    motion.addEventListener('change', resize);
    resize();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      motion.removeEventListener('change', resize);
    };
  }, []);

  const [showPassword, setShowPassword] = useState(false);
  const [formMessage, setFormMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    console.log(formData);
    setFormMessage('Thanks. Your details have been received.');
  };

  return (
    <main className="signup-page">
      <section className="auth-panel" aria-label="Welcome to Christ Alive Power Assembly">
        <canvas ref={canvasRef} className="auth-panel-canvas" aria-hidden="true" />
        <Link to="/" className="auth-brand">
          <img className="auth-logo" src={ChurchLogo} alt="" width="48" height="48" />
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

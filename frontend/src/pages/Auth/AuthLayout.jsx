import { useEffect, useState } from 'react';
import Church02 from '../../assets/images/slide-02.jpg';
import Church03 from '../../assets/images/slide-03.jpg';
import Church04 from '../../assets/images/slide-04.jpg';
import { Link } from 'react-router';
import Logo from '../../assets/images/capa-logo.png';
import './AuthLayout.css';

const churchImages = [Church02, Church03, Church04];

export const AuthLayout = ({ children, className = '', image }) => {
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const images = [image, ...churchImages.filter((source) => source !== image)].filter(Boolean);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => setSlide((current) => (current + 1) % images.length), 10000);
    return () => window.clearInterval(timer);
  }, [paused, images.length]);

  return (
  <main className={`auth-page auth-shell ${className}`}>
      <section className="visual-panel" aria-label="Christ Alive Power Assembly introduction">
        <Link to="/" className="visual-topbar">
          <img src={Logo} className="logo" alt="logo image" />
          <span className="brand-name">Christ Alive Power Assembly</span>
        </Link>

        <div className="auth-photo-slides" aria-hidden="true">
          {images.map((source, index) => (
            <img key={source} className={`auth-church-image${index === slide ? ' is-active' : ''}`} src={source} alt="" />
          ))}
        </div>
        <div className="auth-glow-grid" aria-hidden="true"><span /><span /><span /></div>

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
          <button className="auth-slideshow-toggle" type="button" onClick={() => setPaused((current) => !current)} aria-label={paused ? 'Resume background slideshow' : 'Pause background slideshow'}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
              {paused ? <path d="M8 5v14l11-7z" /> : <><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></>}
            </svg>
          </button>
        </div>
      </section>

    <section className="form-panel" aria-labelledby="form-title">
      <div className="form-wrap">
        <div className="mobile-brand">
          <span className="brand-mark">C</span> CAPA / 01
        </div>
        {children}
      </div>
      <span className="corner-number">01 / 02</span>
    </section>
  </main>
  );
};

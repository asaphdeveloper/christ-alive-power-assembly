import { Link } from 'react-router';
import Logo from '../../assets/images/capa-logo.png';
import './AuthLayout.css';

export const AuthLayout = ({ children, className = '' }) => (
  <main className={`auth-page auth-shell ${className}`}>
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
        {children}
      </div>
      <span className="corner-number">01 / 02</span>
    </section>
  </main>
);

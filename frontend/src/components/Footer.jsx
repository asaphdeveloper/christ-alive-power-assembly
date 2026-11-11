import Logo from '../assets/images/logo.webp';
import './Footer.css';

const exploreLinks = [
  ['Home', '/'],
  ['About us', '/#about-section'],
  ['Resources', '/#resources-section'],
  ['Upcoming events', '/#upcoming-section'],
];
const branchLinks = [
  ['Bauchi Expression', '/bauchi-expression'],
  ['Wukari Expression', '/wukari-expression'],
  ['Jos Expression', '/jos-expression'],
];

export const Footer = () => (
  <footer className="church-footer" id="footer-section">
    <div className="church-footer-inner">
      <div className="church-footer-welcome">
        <div>
          <p className="church-footer-eyebrow">There is a place for you here</p>
          <h2>Let’s grow in faith.<br /><span>Together.</span></h2>
        </div>
        <a className="church-footer-visit" href="/#branches-section">
          Find a church near you <span aria-hidden="true">↗</span>
        </a>
      </div>

      <div className="church-footer-main">
        <div className="church-footer-brand">
          <a className="church-footer-brand-link" href="/" aria-label="Christ Alive Power Assembly home">
            <img decoding="async" src={Logo} alt="" width="56" height="56" loading="lazy" />
            <span>Christ Alive<br />Power Assembly</span>
          </a>
          <p>A community centred on Jesus Christ. Growing through worship, grounded in the Word, and sharing His love with the world.</p>
          <div className="church-footer-scripture">
            <p>“That I may know Him.”</p>
            <cite>Philippians 3:10</cite>
          </div>
        </div>

        <nav className="church-footer-nav" aria-label="Footer navigation">
          <h3>Explore</h3>
          <ul>{exploreLinks.map(([label, href]) => <li key={href}><a href={href}>{label}</a></li>)}</ul>
        </nav>

        <nav className="church-footer-nav" aria-label="Church branches">
          <h3>Our branches</h3>
          <ul>{branchLinks.map(([label, href]) => <li key={href}><a href={href}>{label}</a></li>)}</ul>
          <a className="church-footer-all-branches" href="/#branches-section">Explore our locations <span aria-hidden="true">↗</span></a>
        </nav>

        <div className="church-footer-connect">
          <h3>Stay connected</h3>
          <p>Keep up with church events and find materials to support your walk with God throughout the week.</p>
          <a href="/#resources-section">Browse the resource library <span aria-hidden="true">→</span></a>
        </div>
      </div>

      <div className="church-footer-bottom">
        <p>© {new Date().getFullYear()} Christ Alive Power Assembly. All rights reserved.</p>
        <a href="#footer-section" onClick={(event) => {
          event.preventDefault();
          window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
        }}>Back to top <span aria-hidden="true">↑</span></a>
      </div>
    </div>
  </footer>
);

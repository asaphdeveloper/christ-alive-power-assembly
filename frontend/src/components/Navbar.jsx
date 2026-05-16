import { Link } from 'react-router';
import RightUpGreenIcon from '../assets/images/icons/right-up-green.png';
import RightUpBlackIcon from '../assets/images/icons/right-up-black.png';
import DownArrowIcon from '../assets/images/icons/down-arrow.png';
import Logo from '../assets/images/capa-logo.png';
import './Navbar.css';
import './NavBarMobile.css';

export const Navbar = () => {
  return (
    <nav className="nav-bar">
      <Link to="/" className="left-section">
        <img src={Logo} className="logo" alt="logo image" />
      </Link>
      <ul className="middle-section nav-links">
        <li className="nav-link">
          <Link className="link main-link" to="/">Home</Link>
        </li>
        <li className="nav-link has-menu">
          <a className="link main-link" href="#about-section">About Us</a>
          <img src={DownArrowIcon} className="link-icon" />

          <div className="dropdown about-dropdown">
            <ul>
              <li>
                <a href="#">Lead Pastor</a>
                <img src={RightUpGreenIcon} className="dropdown-link-icon" />
              </li>
              <li>
                <a href="#">Services & Programs</a>
                <img src={RightUpGreenIcon} className="dropdown-link-icon" />
              </li>
              <li>
                <a href="#">Upcoming Events</a>
                <img src={RightUpGreenIcon} className="dropdown-link-icon" />
              </li>
            </ul>
            <ul>
              <li>
                <a href="#">Facebook Page</a>
                <img src={RightUpGreenIcon} className="dropdown-link-icon" />
              </li>
              <li>
                <a href="#">Youtube Page</a>
                <img src={RightUpGreenIcon} className="dropdown-link-icon" />
              </li>
            </ul>
          </div>
        </li>
        <li className="nav-link has-menu">
          <a className="link main-link" href="#">Ministries</a>
          <img src={DownArrowIcon} className="link-icon" />

          <div className="dropdown ministries-dropdown">
            <ul>
              <li>
                <a href="/bauchi-expression">Bauchi Expression</a>
                <img src={RightUpGreenIcon} className="dropdown-link-icon" />
              </li>
              <li>
                <a href="/wukari-expression">Wukari Expression</a>
                <img src={RightUpGreenIcon} className="dropdown-link-icon" />
              </li>
              <li>
                <a href="/jos-expression">Jos Expression</a>
                <img src={RightUpGreenIcon} className="dropdown-link-icon" />
              </li>
            </ul>
            <ul>
              <li>
                <a href="#">Outreaches</a>
                <img src={RightUpGreenIcon} className="dropdown-link-icon" />
              </li>
              <li>
                <a href="#">Singles Forum</a>
                <img src={RightUpGreenIcon} className="dropdown-link-icon" />
              </li>
              <li>
                <a href="#">Couples Night</a>
                <img src={RightUpGreenIcon} className="dropdown-link-icon" />
              </li>
            </ul>
          </div>
        </li>
        <li className="nav-link has-menu">
          <a className="link main-link" href="#">Resources</a>
          <img src={DownArrowIcon} className="link-icon" />

          <div className="dropdown resources-dropdown">
            <ul>
              <li>
                <a href="#">Audio Sermons</a>
                <img src={RightUpGreenIcon} className="dropdown-link-icon" />
              </li>
              <li>
                <a href="#">Gallery</a>
                <img src={RightUpGreenIcon} className="dropdown-link-icon" />
              </li>
              <li>
                <a href="#">Sunday Bulletin</a>
                <img src={RightUpGreenIcon} className="dropdown-link-icon" />
              </li>
            </ul>
            <ul>
              <li>
                <a href="#">Documents</a>
                <img src={RightUpGreenIcon} className="dropdown-link-icon" />
              </li>
            </ul>
          </div>
        </li>
        <li className="nav-link">
          <a className="link main-link" href="#">Givings</a>
        </li>
      </ul>
      <div className="right-section">
        <a href="#" className="btn-primary contact-us-btn">
          <span>Contact Us</span>
          <div className="btn-primary-icon center">
            <img src={RightUpBlackIcon} />
          </div>
        </a>
        <button className="menu center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 9h16.5m-16.5 6.75h16.5"
            />
          </svg>
        </button>
      </div>
    </nav>
  );
};
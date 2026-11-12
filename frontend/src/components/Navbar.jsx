import { useRef, useState } from 'react';
import { Link } from 'react-router';
import RightUpGreenIcon from '../assets/images/icons/right-up-green.png';
import RightUpBlackIcon from '../assets/images/icons/right-up-black.png';
import DownArrowIcon from '../assets/images/icons/down-arrow.png';
import Logo from '../assets/images/logo.webp';
import './Navbar.css';
import './NavBarMobile.css';

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef(null);
  const closeMenu = () => {
    setMenuOpen(false);
    menuButton.current?.focus();
  };
  return (
    <nav
      className='nav-bar'
      aria-label='Main navigation'
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          const trigger = event.target
            .closest('.has-menu')
            ?.querySelector('.main-link');
          if (trigger && !menuOpen) trigger.focus();
          else closeMenu();
          event.currentTarget.classList.add('menus-dismissed');
        }
      }}
      onFocus={(event) =>
        event.currentTarget.classList.remove('menus-dismissed')
      }
      onMouseOver={(event) =>
        event.currentTarget.classList.remove('menus-dismissed')
      }
    >
      <Link to='/' className='left-section'>
        <img
          width='500'
          height='551'
          src={Logo}
          fetchPriority='high'
          className='logo'
          alt='Christ Alive Power Assembly home'
        />
      </Link>
      <ul
        id='main-navigation'
        className={`middle-section nav-links${menuOpen ? ' is-open' : ''}`}
        onClick={(event) => {
          if (event.target.closest('a')) setMenuOpen(false);
        }}
      >
        <li className='nav-link'>
          <Link className='link main-link' to='/'>
            Home
          </Link>
        </li>
        <li className='nav-link has-menu'>
          <a className='link main-link' href='#about-section'>
            About Us
          </a>
          <img
            decoding='async'
            width='16'
            height='16'
            alt=''
            src={DownArrowIcon}
            className='link-icon'
          />

          <div className='dropdown about-dropdown'>
            <ul>
              <li>
                <a href='#'>Lead Pastor</a>
                <img
                  decoding='async'
                  width='16'
                  height='16'
                  alt=''
                  src={RightUpGreenIcon}
                  className='dropdown-link-icon'
                />
              </li>
              <li>
                <a href='#'>Services & Programs</a>
                <img
                  decoding='async'
                  width='16'
                  height='16'
                  alt=''
                  src={RightUpGreenIcon}
                  className='dropdown-link-icon'
                />
              </li>
              <li>
                <a href='#'>Upcoming Events</a>
                <img
                  decoding='async'
                  width='16'
                  height='16'
                  alt=''
                  src={RightUpGreenIcon}
                  className='dropdown-link-icon'
                />
              </li>
            </ul>
            <ul>
              <li>
                <a href='#'>Facebook Page</a>
                <img
                  decoding='async'
                  width='16'
                  height='16'
                  alt=''
                  src={RightUpGreenIcon}
                  className='dropdown-link-icon'
                />
              </li>
              <li>
                <a href='#'>Youtube Page</a>
                <img
                  decoding='async'
                  width='16'
                  height='16'
                  alt=''
                  src={RightUpGreenIcon}
                  className='dropdown-link-icon'
                />
              </li>
            </ul>
          </div>
        </li>
        <li className='nav-link has-menu'>
          <a className='link main-link' href='#'>
            Ministries
          </a>
          <img
            decoding='async'
            width='16'
            height='16'
            alt=''
            src={DownArrowIcon}
            className='link-icon'
          />

          <div className='dropdown ministries-dropdown'>
            <ul>
              <li>
                <a href='/bauchi-expression'>Bauchi Expression</a>
                <img
                  decoding='async'
                  width='16'
                  height='16'
                  alt=''
                  src={RightUpGreenIcon}
                  className='dropdown-link-icon'
                />
              </li>
              <li>
                <a href='/wukari-expression'>Wukari Expression</a>
                <img
                  decoding='async'
                  width='16'
                  height='16'
                  alt=''
                  src={RightUpGreenIcon}
                  className='dropdown-link-icon'
                />
              </li>
              <li>
                <a href='/jos-expression'>Jos Expression</a>
                <img
                  decoding='async'
                  width='16'
                  height='16'
                  alt=''
                  src={RightUpGreenIcon}
                  className='dropdown-link-icon'
                />
              </li>
            </ul>
            <ul>
              <li>
                <a href='#'>Outreaches</a>
                <img
                  decoding='async'
                  width='16'
                  height='16'
                  alt=''
                  src={RightUpGreenIcon}
                  className='dropdown-link-icon'
                />
              </li>
              <li>
                <a href='#'>Singles Forum</a>
                <img
                  decoding='async'
                  width='16'
                  height='16'
                  alt=''
                  src={RightUpGreenIcon}
                  className='dropdown-link-icon'
                />
              </li>
              <li>
                <a href='#'>Couples Night</a>
                <img
                  decoding='async'
                  width='16'
                  height='16'
                  alt=''
                  src={RightUpGreenIcon}
                  className='dropdown-link-icon'
                />
              </li>
            </ul>
          </div>
        </li>
        <li className='nav-link has-menu'>
          <a className='link main-link' href='#'>
            Resources
          </a>
          <img
            decoding='async'
            width='16'
            height='16'
            alt=''
            src={DownArrowIcon}
            className='link-icon'
          />

          <div className='dropdown resources-dropdown'>
            <ul>
              <li>
                <a href='#'>Audio Sermons</a>
                <img
                  decoding='async'
                  width='16'
                  height='16'
                  alt=''
                  src={RightUpGreenIcon}
                  className='dropdown-link-icon'
                />
              </li>
              <li>
                <a href='#'>Gallery</a>
                <img
                  decoding='async'
                  width='16'
                  height='16'
                  alt=''
                  src={RightUpGreenIcon}
                  className='dropdown-link-icon'
                />
              </li>
              <li>
                <a href='#'>Sunday Bulletin</a>
                <img
                  decoding='async'
                  width='16'
                  height='16'
                  alt=''
                  src={RightUpGreenIcon}
                  className='dropdown-link-icon'
                />
              </li>
            </ul>
            <ul>
              <li>
                <a href='#'>Documents</a>
                <img
                  decoding='async'
                  width='16'
                  height='16'
                  alt=''
                  src={RightUpGreenIcon}
                  className='dropdown-link-icon'
                />
              </li>
            </ul>
          </div>
        </li>
        <li className='nav-link'>
          <a className='link main-link' href='#'>
            Givings
          </a>
        </li>
        <li className='nav-link'>
          <a className='link main-link' href='/login'>
            Login
          </a>
        </li>
      </ul>
      <div className='right-section'>
        <a href='#' className='btn-primary contact-us-btn'>
          <span>Contact Us</span>
          <div className='btn-primary-icon center'>
            <img
              decoding='async'
              width='16'
              height='16'
              alt=''
              src={RightUpBlackIcon}
            />
          </div>
        </a>
        <button
          ref={menuButton}
          className='menu center'
          type='button'
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={menuOpen}
          aria-controls='main-navigation'
          onClick={() => setMenuOpen((value) => !value)}
        >
          <svg
            aria-hidden='true'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth='1.5'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M3.75 9h16.5m-16.5 6.75h16.5'
            />
          </svg>
        </button>
      </div>
    </nav>
  );
};

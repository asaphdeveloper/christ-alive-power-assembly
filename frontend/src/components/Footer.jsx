import { HugeiconsIcon } from '@hugeicons/react';
import { Facebook, Youtube, Twitter, Instagram, TiktokIcon } from '@hugeicons/core-free-icons';
import './Footer.css';

export const Footer = () => {
  return (
    <footer className="footer" id="footer-section">
      <div className="footer-top">
        <div className="footer-links-container">
          <div className="footer-links">
            <div className="footer-link-heading">Quick links</div>
            <a href="#" className="footer-link">Home</a>
            <a href="#" className="footer-link">About Us</a>
            <a href="#" className="footer-link">Resources</a>
            <a href="#" className="footer-link">Givings</a>
            <a href="#" className="footer-link">Contact us</a>
          </div>
          <div className="footer-links">
            <div className="footer-link-heading">Branches</div>
            <a href="#" className="footer-link">Jos branch</a>
            <a href="#" className="footer-link">Bauchi branch</a>
            <a href="#" className="footer-link">Wukari branch</a>
            <a href="#" className="footer-link">Zango branch</a>
            <a href="#" className="footer-link">Sabon kaura branch</a>
          </div>
          <div className="footer-links">
            <div className="footer-link-heading">Socials</div>
            <a href="#" className="footer-link">Facebook</a>
            <a href="#" className="footer-link">Youtube</a>
            <a href="#" className="footer-link">X</a>
            <a href="#" className="footer-link">Instagram</a>
            <a href="#" className="footer-link">Tiktok</a>
          </div>
          <div className="footer-links mail-section">
            <div className="footer-link-heading">Subscribe</div>
            <p>Subscribe To Join Our Community To Receive Updates</p>
            <div className="footer-input-container">
              <input type="text" placeholder="Enter your email" />
              <button className="subscribe-btn">Subcribe</button>
            </div>
            <div className="social-links">
              <a className="social-link" href="#">
                <HugeiconsIcon icon={Facebook} />
              </a>
              <a className="social-link" href="#">
                <HugeiconsIcon icon={Youtube} />
              </a>
              <a className="social-link" href="#">
                <HugeiconsIcon icon={Instagram} />
              </a>
              <a className="social-link" href="#">
                <HugeiconsIcon icon={Twitter} />
              </a>
              <a className="social-link" href="#">
                <HugeiconsIcon icon={TiktokIcon} />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="copyright">
          Copyright &copy; 2025. CAPA. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
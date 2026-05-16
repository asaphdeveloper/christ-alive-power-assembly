import { Link } from 'react-router';
import { HugeiconsIcon } from '@hugeicons/react';
import { Location01Icon, MailIcon, CallIcon, Facebook02Icon, YoutubeIcon, TelegramIcon, InstagramIcon } from '@hugeicons/core-free-icons';
import './BranchAside.css';

export const BranchAside = () => {
  return (
    <aside className="branch-aside">
      <div className="branch-aside-card">
        <h4>Contact Details</h4>
        <div className='branch-aside-cards'>
          <div className='branch-aside-card-item'>
            <HugeiconsIcon icon={Location01Icon} className="branch-aside-card-icon" alt="" />
            <span className="branch-aside-card-address"> Headquater Bauchi state, Nigeria</span><br />
          </div>
          <div className='branch-aside-card-item'>
            <HugeiconsIcon icon={MailIcon} className="branch-aside-card-icon" alt="" />
            <span className="branch-aside-card-email"> info@capa.org</span><br />
          </div>
          <div className='branch-aside-card-item'>
            <HugeiconsIcon icon={CallIcon} className="branch-aside-card-icon" alt="" />
            <span className="branch-aside-card-phone-number"> +234-400-373-22</span><br />
          </div>
          <div className="branch-aside-card-row">
            <a href='#' className='branch-aside-card-item'>
              <HugeiconsIcon icon={Facebook02Icon} className="branch-aside-card-icon" alt="" />
              <span className="branch-aside-card-phone-number">Facebook</span><br />
            </a>
            <a href='#' className='branch-aside-card-item'>
              <HugeiconsIcon icon={YoutubeIcon} className="branch-aside-card-icon" alt="" />
              <span className="branch-aside-card-phone-number">Youtube</span><br />
            </a>
          </div>
          <div className="branch-aside-card-row">
            <a href='#' className='branch-aside-card-item'>
              <HugeiconsIcon icon={InstagramIcon} className="branch-aside-card-icon" alt="" />
              <span className="branch-aside-card-phone-number">Instagram</span><br />
            </a>
            <a href='#' className='branch-aside-card-item'>
              <HugeiconsIcon icon={TelegramIcon} className="branch-aside-card-icon" alt="" />
              <span className="branch-aside-card-phone-number">Telegram</span><br />
            </a>
          </div>
        </div>
        <a className="branch-aside-card-btn" href="giving.html">Locate Us</a>
      </div>
    </aside>
  );
};
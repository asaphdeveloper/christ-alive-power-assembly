import { HugeiconsIcon } from '@hugeicons/react';
import { Location03Icon, Location01Icon } from '@hugeicons/core-free-icons';
import Slide1 from '../../assets/images/slide-01.jpg';
import Slide2 from '../../assets/images/slide-02.jpg';
import Slide3 from '../../assets/images/slide-03.jpg';
import ArrowPrev from '../../assets/images/icons/arrow-prev.svg';
import ArrowNext from '../../assets/images/icons/arrow-next.svg';
import { SectionHeading } from './SectionHeading';
import RightUpIcon from '../../assets/images/icons/right-up.png';
import './BranchesSection.css';

export const Branches = () => {
  return (
    <section className="branches-summary" id="branches-section" aria-labelledby="branches-title">
      <SectionHeading className="branches-heading" icon={Location03Icon} label="Visit Us" titleId="branches-title">
        Visit Any Of Our<br /><span>Branches</span>
      </SectionHeading>
      <div className="branches-cards">
        <a href="/" className="branch-card branch-card-1 reveal-section">
          <div className="branch-card-image-container">
            <img
              className="branch-card-image"
              data-src="images/slide-01.jpg"
              src={Slide1}
              alt="Branch card image"
            />
          </div>
          <div className="branch-card-state">BAUCHI</div>
          <div className="branch-card-button">
            <HugeiconsIcon icon={Location01Icon} className='branch-card-button-icon' />
            <span>Bauchi</span>
          </div>
          <h3>Bauchi Expressions</h3>
          <img src={RightUpIcon} className="branch-card-icon" />
          <div className="branch-card-box">
            Christ Alive Power Assembly Have Branches in Bauchi State,
            Alongside it's Headquater. Click To Learn More.
          </div>
        </a>
        <a href="/" className="branch-card branch-card-2 reveal-section">
          <div className="branch-card-image-container">
            <img
              className="branch-card-image"
              data-src="images/slide-02.jpg"
              src={Slide2}
              alt="Branch card image"
            />
          </div>
          <div className="branch-card-state">WUKARI</div>
          <div className="branch-card-button">
            <HugeiconsIcon icon={Location01Icon} className='branch-card-button-icon' />
            <span>Taraba</span>
          </div>
          <h3>Wukari Expressions</h3>
          <img src={RightUpIcon} className="branch-card-icon" />
          <div className="branch-card-box">
            Christ Alive Power Assembly Have Branches Located in Taraba State,
            Wukari To Be Precise. Learn More.
          </div>
        </a>
        <a href="/" className="branch-card branch-card-3 reveal-section">
          <div className="branch-card-image-container">
            <img
              className="branch-card-image"
              data-src="images/slide-03.jpg"
              src={Slide3}
              alt="Branch card image"
            />
          </div>
          <div className="branch-card-state">JOS</div>
          <div className="branch-card-button">
            <HugeiconsIcon icon={Location01Icon} className='branch-card-button-icon' />
            <span>Plateau</span>
          </div>
          <h3>Jos Expressions</h3>
          <img src={RightUpIcon} className="branch-card-icon" />
          <div className="branch-card-box">
            Christ Alive Power Assembly Have A Branch Located in Plateau
            State, Jos To Be Precise. Click To Learn More.
          </div>
        </a>
      </div>
      <div className="branches-swiper-btns">
        <button className="branches-swiper-btn prev-btn">
          <img src={ArrowPrev} alt="" />
        </button>
        <button className="branches-swiper-btn next-btn">
          <img src={ArrowNext} alt="" />
        </button>
      </div>
    </section>
  );
};

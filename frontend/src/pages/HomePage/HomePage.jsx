import { About } from './AboutSection';
import { Branches } from './BranchesSection';
import { Upcoming } from './UpcomingSection';
import { Pastor } from './PastorSection';
import { Giving } from './GivingSection';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import Slide01 from '../../assets/images/slide-01.jpg';
import Slide02 from '../../assets/images/slide-02.jpg';
import Slide03 from '../../assets/images/slide-03.jpg';
import Slide04 from '../../assets/images/slide-04.jpg';
import RightUpBlackIcon from '../../assets/images/icons/right-up-black.png';
import ChevronPrevIcon from '../../assets/images/icons/chevron-prev.svg';
import ChevronNextIcon from '../../assets/images/icons/chevron-next.svg';
import Logo from '../../assets/images/capa-logo.png';
import '../../index.css';
import './HomePage.css';
import './HomePageMobile.css';

export const HomePage = () => {
  return (
    <>
      <title>Christ Alive Power Assembly Official Website</title>
      <link rel="shortcut icon" href={Logo} type="image/x-icon" />

      <header className="js-header">
        <Navbar />
        <section className="hero">
          <div className="hero-overlay-content">
            <p className="hero-overlay-text">Welcome To</p>
            <h1 className="hero-overlay-title">
              <div className="text-1"><span>Christ</span><span>Alive</span></div>
              <div className="text-2"><span>Power</span> <span>Assembly</span></div>
            </h1>
            <a href="#resources-section" className="btn-primary hero-btn">
              <span>Get Resource</span>
              <div className="btn-primary-icon center">
                <img
                  src={RightUpBlackIcon}
                  alt="Navigate to resources section button"
                />
              </div>
            </a>
          </div>

          <div className="swiper">
            <div className="swiper-slide">
              <div className="swiper-overlay"></div>
              <img
                className="swiper-image"
                src={Slide02}
                alt="Congregation worshipping at Christ Alive Power Assembly"
              />
            </div>
            <div className="swiper-slide">
              <div className="swiper-overlay"></div>
              <img
                className="swiper-image"
                src={Slide03}
                alt="Church members gathered for Sunday service"
              />
            </div>
            <div className="swiper-slide">
              <div className="swiper-overlay"></div>
              <img
                className="swiper-image"
                src={Slide04}
                alt="Praise and worship session at Christ Alive Power Assembly"
              />
            </div>
            <div className="swiper-slide">
              <div className="swiper-overlay"></div>
              <img
                className="swiper-image"
                src={Slide01}
                alt="Lead pastor delivering a sermon to the congregation"
              />
            </div>
            <div className="swiper-button-prev">
              <img
                src={ChevronPrevIcon}
                alt="Previous slide button"
              />
            </div>
            <div className="swiper-button-next">
              <img src={ChevronNextIcon} alt="Next slide button" />
            </div>
            <div className="swiper-pagination"></div>
          </div>
        </section>
      </header>

      <main className="main">
        <About />
        <Pastor />
        <Branches />
        <Upcoming />
        <Giving />
      </main>
      <Footer />
      <div className="scroll-to-top js-scroll-to-top hidden">
        <img src="images/icons/arrow-up-icon.svg" alt="Scroll to top button" />
      </div>
    </>
  );
};
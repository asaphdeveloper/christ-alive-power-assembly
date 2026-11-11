import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, LazyMotion, domAnimation, m as Motion, useReducedMotion } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft01Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons';
const Slide01 = '/images/slide-01-1280.webp';
const Slide02 = '/images/slide-02-1280.webp';
const Slide03 = '/images/slide-03-1280.webp';
const Slide04 = '/images/slide-04-1280.webp';
import RightUpBlackIcon from '../../../assets/images/icons/right-up-black.png';
import './Hero.css';

const slides = [
  { image: Slide02, alt: 'Congregation worshipping at Christ Alive Power Assembly' },
  { image: Slide03, alt: 'Church members gathered for Sunday service' },
  { image: Slide04, alt: 'Praise and worship session at Christ Alive Power Assembly' },
  { image: Slide01, alt: 'Lead pastor delivering a sermon to the congregation' },
];

export const Hero = () => {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const touchStart = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const onVisibilityChange = () => setPageVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, []);

  useEffect(() => {
    if (paused || userPaused || !pageVisible || reducedMotion) return undefined;
    const timer = window.setTimeout(() => setActive((index) => (index + 1) % slides.length), 5000);
    return () => window.clearTimeout(timer);
  }, [active, paused, userPaused, pageVisible, reducedMotion]);

  const move = (step) => setActive((index) => (index + step + slides.length) % slides.length);

  const onKeyDown = (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      move(event.key === 'ArrowLeft' ? -1 : 1);
    }
  };

  const onTouchStart = (event) => {
    touchStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };
  };

  const onTouchEnd = (event) => {
    if (!touchStart.current) return;
    const distanceX = event.changedTouches[0].clientX - touchStart.current.x;
    const distanceY = event.changedTouches[0].clientY - touchStart.current.y;
    if (Math.abs(distanceX) > 50 && Math.abs(distanceX) > Math.abs(distanceY)) {
      move(distanceX < 0 ? 1 : -1);
    }
    touchStart.current = null;
  };

  return (
    <LazyMotion features={domAnimation} strict><section
      className="hero"
      aria-label="Welcome slideshow"
      aria-roledescription="carousel"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
      }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="hero-slides" aria-hidden="true">
        <AnimatePresence initial={false}>
          <Motion.div
            className="hero-slide"
            key={active}
            initial={{ opacity: reducedMotion ? 1 : 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: reducedMotion ? 1 : 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.85 }}
          >
            <Motion.img
              src={slides[active].image}
              srcSet={`${slides[active].image.replace('1280', '640')} 640w, ${slides[active].image.replace('1280', '960')} 960w, ${slides[active].image} 1280w, ${slides[active].image.replace('1280', '1536')} 1536w, ${slides[active].image.replace('1280', '2048')} 2048w`}
              sizes="100vw"
              width="2048"
              height="1365"
              loading="eager"
              decoding="async"
              fetchPriority={active === 0 ? 'high' : 'auto'}
              alt=""
              animate={{ scale: reducedMotion ? 1 : 1.08 }}
              initial={{ scale: 1 }}
              transition={{ duration: 6, ease: 'linear' }}
            />
          </Motion.div>
        </AnimatePresence>
      </div>
      <div className="hero-shade" aria-hidden="true" />

      <div className="hero-content" key={active}>
        <p className="hero-eyebrow">Welcome To</p>
        <h1 className="hero-title">
          <span className="hero-title-line"><span>Christ</span><span>Alive</span></span>
          <span className="hero-title-line"><span>Power</span><span>Assembly</span></span>
        </h1>
        <div className="hero-action">
          <a href="#resources-section" className="btn-primary hero-btn">
            <span>Get Resource</span>
            <span className="btn-primary-icon center" aria-hidden="true">
              <img decoding="async" width="16" height="16" src={RightUpBlackIcon} alt="" />
            </span>
          </a>
        </div>
      </div>

      <button className="hero-arrow hero-arrow-prev" type="button" onClick={() => move(-1)} aria-label="Previous slide">
        <HugeiconsIcon icon={ArrowLeft01Icon} size={22} aria-hidden="true" />
      </button>
      <button className="hero-arrow hero-arrow-next" type="button" onClick={() => move(1)} aria-label="Next slide">
        <HugeiconsIcon icon={ArrowRight01Icon} size={22} aria-hidden="true" />
      </button>
      <div className="hero-dots" role="group" aria-label="Choose a slide">
        <button className="hero-pause" type="button" onClick={() => setUserPaused((value) => !value)} aria-label={userPaused ? 'Play slideshow' : 'Pause slideshow'} aria-pressed={userPaused}>
          <span aria-hidden="true">{userPaused ? '▶' : 'Ⅱ'}</span>
        </button>
        {slides.map((slide, index) => (
          <button
            className="hero-dot"
            type="button"
            key={slide.image}
            aria-label={`Show slide ${index + 1} of ${slides.length}: ${slide.alt}`}
            aria-current={active === index ? 'true' : undefined}
            onClick={() => setActive(index)}
          />
        ))}
      </div>
      <span className="hero-sr-only" aria-live={paused || userPaused ? 'polite' : 'off'}>Slide {active + 1} of {slides.length}: {slides[active].alt}</span>
    </section></LazyMotion>
  );
};

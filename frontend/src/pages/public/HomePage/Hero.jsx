import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion as Motion, useReducedMotion } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft01Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons';
import Slide01 from '../../../assets/images/slide-01.jpg';
import Slide02 from '../../../assets/images/slide-02.jpg';
import Slide03 from '../../../assets/images/slide-03.jpg';
import Slide04 from '../../../assets/images/slide-04.jpg';
import RightUpBlackIcon from '../../../assets/images/icons/right-up-black.png';
import './Hero.css';

const slides = [
  { image: Slide02, alt: 'Congregation worshipping at Christ Alive Power Assembly' },
  { image: Slide03, alt: 'Church members gathered for Sunday service' },
  { image: Slide04, alt: 'Praise and worship session at Christ Alive Power Assembly' },
  { image: Slide01, alt: 'Lead pastor delivering a sermon to the congregation' },
];

const entrance = (delay, reducedMotion) => ({
  initial: reducedMotion ? false : { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: reducedMotion ? 0 : 0.55, delay: reducedMotion ? 0 : delay, ease: 'easeOut' },
});

export const Hero = () => {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const touchStart = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const onVisibilityChange = () => setPageVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, []);

  useEffect(() => {
    if (paused || !pageVisible || reducedMotion) return undefined;
    const timer = window.setTimeout(() => setActive((index) => (index + 1) % slides.length), 5000);
    return () => window.clearTimeout(timer);
  }, [active, paused, pageVisible, reducedMotion]);

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
    <section
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
        <Motion.p className="hero-eyebrow" {...entrance(0.05, reducedMotion)}>Welcome To</Motion.p>
        <Motion.h1 className="hero-title" {...entrance(0.17, reducedMotion)}>
          <span className="hero-title-line"><span>Christ</span><span>Alive</span></span>
          <span className="hero-title-line"><span>Power</span><span>Assembly</span></span>
        </Motion.h1>
        <Motion.div className="hero-action" {...entrance(0.31, reducedMotion)}>
          <a href="#resources-section" className="btn-primary hero-btn">
            <span>Get Resource</span>
            <span className="btn-primary-icon center" aria-hidden="true">
              <img src={RightUpBlackIcon} alt="" />
            </span>
          </a>
        </Motion.div>
      </div>

      <button className="hero-arrow hero-arrow-prev" type="button" onClick={() => move(-1)} aria-label="Previous slide">
        <HugeiconsIcon icon={ArrowLeft01Icon} size={22} aria-hidden="true" />
      </button>
      <button className="hero-arrow hero-arrow-next" type="button" onClick={() => move(1)} aria-label="Next slide">
        <HugeiconsIcon icon={ArrowRight01Icon} size={22} aria-hidden="true" />
      </button>
      <div className="hero-dots" role="group" aria-label="Choose a slide">
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
      <span className="hero-sr-only" aria-live="polite">Slide {active + 1} of {slides.length}: {slides[active].alt}</span>
    </section>
  );
};

import { useEffect, useRef, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft01Icon, ArrowRight01Icon, Location03Icon, Location01Icon } from '@hugeicons/core-free-icons';
import Slide1 from '../../assets/images/slide-01.jpg';
import Slide2 from '../../assets/images/slide-02.jpg';
import Slide3 from '../../assets/images/slide-03.jpg';
import { SectionHeading } from './SectionHeading';
import RightUpIcon from '../../assets/images/icons/right-up.png';
import './BranchesSection.css';

export const Branches = () => {
  const cardsRef = useRef(null);
  const animationFrameRef = useRef(null);
  const [scrollState, setScrollState] = useState({ overflow: false, atStart: true, atEnd: true });

  useEffect(() => {
    const cards = cardsRef.current;
    if (!cards) return undefined;

    const updateScrollState = () => {
      const maxScroll = Math.max(0, cards.scrollWidth - cards.clientWidth);
      setScrollState({
        overflow: maxScroll > 1,
        atStart: cards.scrollLeft <= 1,
        atEnd: cards.scrollLeft >= maxScroll - 1,
      });
    };

    updateScrollState();
    cards.addEventListener('scroll', updateScrollState, { passive: true });
    const stopAnimation = () => {
      if (animationFrameRef.current !== null) cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
      cards.style.scrollSnapType = '';
    };
    cards.addEventListener('pointerdown', stopAnimation);
    cards.addEventListener('wheel', stopAnimation, { passive: true });
    const observer = new ResizeObserver(updateScrollState);
    observer.observe(cards);
    Array.from(cards.children).forEach((card) => observer.observe(card));

    return () => {
      cards.removeEventListener('scroll', updateScrollState);
      cards.removeEventListener('pointerdown', stopAnimation);
      cards.removeEventListener('wheel', stopAnimation);
      stopAnimation();
      observer.disconnect();
    };
  }, []);

  const moveCards = (direction) => {
    const cards = cardsRef.current;
    const card = cards?.querySelector('.branch-card');
    if (!cards || !card || cards.scrollWidth <= cards.clientWidth + 1) return;
    const gap = parseFloat(getComputedStyle(cards).columnGap) || 0;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const start = cards.scrollLeft;
    const target = Math.max(0, Math.min(cards.scrollWidth - cards.clientWidth, start + direction * (card.getBoundingClientRect().width + gap)));
    if (animationFrameRef.current !== null) cancelAnimationFrame(animationFrameRef.current);
    if (reducedMotion) {
      cards.style.scrollSnapType = 'none';
      cards.scrollLeft = target;
      cards.style.scrollSnapType = '';
      return;
    }

    cards.style.scrollSnapType = 'none';
    const duration = 480;
    const startedAt = performance.now();
    const animate = (now) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      cards.scrollLeft = start + (target - start) * eased;
      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        animationFrameRef.current = null;
        cards.style.scrollSnapType = '';
      }
    };
    animationFrameRef.current = requestAnimationFrame(animate);
  };

  return (
    <section className="branches-summary" id="branches-section" aria-labelledby="branches-title">
      <SectionHeading className="branches-heading" icon={Location03Icon} label="Visit Us" titleId="branches-title">
        Visit Any Of Our<br /><span>Branches</span>
      </SectionHeading>
      <div className={`branches-cards${scrollState.overflow ? ' has-overflow' : ''}`} ref={cardsRef}>
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
      {scrollState.overflow && <div className="branches-swiper-btns">
        <button className="branches-swiper-btn prev-btn" type="button" aria-label="Previous branches" disabled={scrollState.atStart} onClick={() => moveCards(-1)}>
          <HugeiconsIcon icon={ArrowLeft01Icon} size={20} aria-hidden="true" />
        </button>
        <button className="branches-swiper-btn next-btn" type="button" aria-label="Next branches" disabled={scrollState.atEnd} onClick={() => moveCards(1)}>
          <HugeiconsIcon icon={ArrowRight01Icon} size={20} aria-hidden="true" />
        </button>
      </div>}
    </section>
  );
};

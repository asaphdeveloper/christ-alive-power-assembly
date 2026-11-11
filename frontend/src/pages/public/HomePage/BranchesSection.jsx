import { useEffect, useRef, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft01Icon, ArrowRight01Icon, Location03Icon, Location01Icon } from '@hugeicons/core-free-icons';
const Slide1 = '/images/slide-01-1280.webp';
const Slide2 = '/images/slide-02-1280.webp';
const Slide3 = '/images/slide-03-1280.webp';
import { SectionHeading } from './SectionHeading';
import RightUpIcon from '../../../assets/images/icons/right-up.png';
import './BranchesSection.css';

export const Branches = () => {
  const cardsRef = useRef(null);
  const animationFrameRef = useRef(null);
  const targetRef = useRef(null);
  const [scrollState, setScrollState] = useState({ overflow: false, atStart: true, atEnd: true });

  useEffect(() => {
    const cards = cardsRef.current;
    if (!cards) return undefined;

    const updateScrollState = () => {
      const maxScroll = Math.max(0, cards.scrollWidth - cards.clientWidth);
      const nextState = {
        overflow: maxScroll > 1,
        atStart: cards.scrollLeft <= 1,
        atEnd: cards.scrollLeft >= maxScroll - 1,
      };
      setScrollState((previous) => (
        previous.overflow === nextState.overflow
        && previous.atStart === nextState.atStart
        && previous.atEnd === nextState.atEnd
          ? previous : nextState
      ));
    };

    updateScrollState();
    cards.addEventListener('scroll', updateScrollState, { passive: true });
    const stopAnimation = () => {
      if (animationFrameRef.current !== null) cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
      targetRef.current = null;
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
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const start = cards.scrollLeft;
    const maxScroll = cards.scrollWidth - cards.clientWidth;
    const positions = [...new Set([
      0,
      ...Array.from(cards.children, (item) => Math.max(0, Math.min(maxScroll, item.offsetLeft - card.offsetLeft))),
      maxScroll,
    ])].sort((a, b) => a - b);
    const currentTarget = targetRef.current ?? start;
    const target = direction > 0
      ? positions.find((position) => position > currentTarget + 1) ?? maxScroll
      : positions.findLast((position) => position < currentTarget - 1) ?? 0;
    if (animationFrameRef.current !== null) cancelAnimationFrame(animationFrameRef.current);
    animationFrameRef.current = null;
    targetRef.current = target;
    if (reducedMotion) {
      cards.style.scrollSnapType = 'none';
      cards.scrollLeft = target;
      cards.style.scrollSnapType = '';
      targetRef.current = null;
      return;
    }

    cards.style.scrollSnapType = 'none';
    const duration = 300;
    const startedAt = performance.now();
    const animate = (now) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      cards.scrollLeft = start + (target - start) * eased;
      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        animationFrameRef.current = null;
        targetRef.current = null;
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
            <img srcSet="/images/slide-01-640.webp 640w, /images/slide-01-1280.webp 1280w, /images/slide-01-2048.webp 2048w" sizes="(max-width: 750px) 300px, 400px" loading="lazy" fetchPriority="low" decoding="async" width="2048" height="1365"
              className="branch-card-image"
              src={Slide1}
              alt=""
            />
          </div>
          <div className="branch-card-state">BAUCHI</div>
          <div className="branch-card-button">
            <HugeiconsIcon icon={Location01Icon} className='branch-card-button-icon' />
            <span>Bauchi</span>
          </div>
          <h3>Bauchi Expressions</h3>
          <img loading="lazy" fetchPriority="low" decoding="async" width="16" height="16" alt="" src={RightUpIcon} className="branch-card-icon" />
          <div className="branch-card-box">
            Christ Alive Power Assembly Have Branches in Bauchi State,
            Alongside it's Headquater. Click To Learn More.
          </div>
        </a>
        <a href="/" className="branch-card branch-card-2 reveal-section">
          <div className="branch-card-image-container">
            <img srcSet="/images/slide-02-640.webp 640w, /images/slide-02-1280.webp 1280w, /images/slide-02-2048.webp 2048w" sizes="(max-width: 750px) 300px, 400px" loading="lazy" fetchPriority="low" decoding="async" width="2048" height="1365"
              className="branch-card-image"
              src={Slide2}
              alt=""
            />
          </div>
          <div className="branch-card-state">WUKARI</div>
          <div className="branch-card-button">
            <HugeiconsIcon icon={Location01Icon} className='branch-card-button-icon' />
            <span>Taraba</span>
          </div>
          <h3>Wukari Expressions</h3>
          <img loading="lazy" fetchPriority="low" decoding="async" width="16" height="16" alt="" src={RightUpIcon} className="branch-card-icon" />
          <div className="branch-card-box">
            Christ Alive Power Assembly Have Branches Located in Taraba State,
            Wukari To Be Precise. Learn More.
          </div>
        </a>
        <a href="/" className="branch-card branch-card-3 reveal-section">
          <div className="branch-card-image-container">
            <img srcSet="/images/slide-03-640.webp 640w, /images/slide-03-1280.webp 1280w, /images/slide-03-2048.webp 2048w" sizes="(max-width: 750px) 300px, 400px" loading="lazy" fetchPriority="low" decoding="async" width="2048" height="1365"
              className="branch-card-image"
              src={Slide3}
              alt=""
            />
          </div>
          <div className="branch-card-state">JOS</div>
          <div className="branch-card-button">
            <HugeiconsIcon icon={Location01Icon} className='branch-card-button-icon' />
            <span>Plateau</span>
          </div>
          <h3>Jos Expressions</h3>
          <img loading="lazy" fetchPriority="low" decoding="async" width="16" height="16" alt="" src={RightUpIcon} className="branch-card-icon" />
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

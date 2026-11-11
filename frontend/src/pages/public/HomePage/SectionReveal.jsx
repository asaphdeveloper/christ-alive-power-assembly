import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import './SectionReveal.css';

const revealTargets = [
  '.church-about-photo', '.church-about-content',
  '.pastor-heading', '.pastor-body', '.pastor-btn',
  '.branches-heading', '.branch-card',
  '.church-resources .section-heading', '.church-resources-toolbar', '.church-resource',
  '.upcoming-header', '.upcoming-card',
  '.cta-box', '.church-footer-welcome', '.church-footer-main',
].join(', ');

export const SectionReveal = ({ children, effect }) => {
  const ref = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !ref.current) return undefined;

    const root = ref.current;
    const targets = () => root.querySelectorAll(revealTargets);
    if (!('IntersectionObserver' in window)) {
      targets().forEach((target) => { target.dataset.revealed = 'true'; });
      return undefined;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.dataset.revealed = 'true';
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -7% 0px' });

    const observeTargets = () => {
      targets().forEach((target) => {
        if (target.dataset.revealed !== 'true') observer.observe(target);
      });
    };
    observeTargets();

    // Resource filters can render new cards after the section first appears.
    const changes = effect === 'resources' ? new MutationObserver(observeTargets) : null;
    changes?.observe(root, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      changes?.disconnect();
    };
  }, [effect, reducedMotion]);

  return <div ref={ref} className={`home-reveal home-reveal--${effect}`}>{children}</div>;
};

import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';

export function RouteFocus() {
  const { pathname, hash } = useLocation();
  const previousPath = useRef(pathname);
  useEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    const focusContent = () => {
      const main = document.getElementById('main-content');
      if (!main || main.getAttribute('aria-busy') === 'true') return false;
      const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : main;
      main.focus({ preventScroll: true });
      if (hash) target?.scrollIntoView();
      else window.scrollTo({ top: 0, behavior: 'instant' });
      return true;
    };
    if (focusContent()) return;
    const observer = new MutationObserver(() => {
      if (focusContent()) observer.disconnect();
    });
    observer.observe(document.getElementById('root'), { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [pathname, hash]);
  return null;
}

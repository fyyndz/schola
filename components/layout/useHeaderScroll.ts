'use client';

import { useEffect, useState } from 'react';

export default function useHeaderScroll() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const main = document.getElementById('main-scroll-area');
    const updateScrollState = () => {
      const isDesktop = window.matchMedia('(min-width: 1280px)').matches;
      const scrollTop = isDesktop ? main?.scrollTop ?? 0 : window.scrollY;
      setScrolled(scrollTop > 12);
    };

    window.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);
    main?.addEventListener('scroll', updateScrollState, { passive: true });
    updateScrollState();

    return () => {
      window.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
      main?.removeEventListener('scroll', updateScrollState);
    };
  }, []);

  return scrolled;
}

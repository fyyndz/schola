'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), 1400);
    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="splash-overlay fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#F7FAFC]">
      <div className="splash-brand">
        <Image
          src="/images/schola-brand.png"
          alt="Schola"
          width={220}
          height={90}
          priority
          className="h-auto w-[190px] sm:w-[220px]"
        />
      </div>
      <p className="mt-5 text-sm font-semibold tracking-wide text-[#4D687D]">
        Rencanakan. Fokus. Berhasil.
      </p>
      <div className="mt-6 flex items-center gap-1.5" aria-hidden="true">
        <span className="splash-dot [animation-delay:0ms]" />
        <span className="splash-dot [animation-delay:140ms]" />
        <span className="splash-dot [animation-delay:280ms]" />
      </div>
      <span className="sr-only" role="status">Memuat Schola</span>
    </div>
  );
}

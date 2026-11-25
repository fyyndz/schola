'use client';

import { useEffect, useState } from 'react';
import { PlannerProvider } from '@/context/PlannerContext';
import AppShell from '@/components/layout/AppShell';

/**
 * Data demo memakai waktu saat ini (Date.now) untuk hitung mundur deadline,
 * jadi UI dirender setelah mount agar tidak terjadi hydration mismatch.
 */
export default function PlannerApp() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="h-screen w-screen bg-[#F7FAFC]" />;

  return (
    <PlannerProvider>
      <AppShell />
    </PlannerProvider>
  );
}

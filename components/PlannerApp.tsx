'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PlannerProvider } from '@/context/PlannerContext';
import AppShell from '@/components/layout/AppShell';
import { getCurrentDemoUser } from '@/lib/demo-auth';

/**
 * Data demo memakai waktu saat ini (Date.now) untuk hitung mundur deadline,
 * jadi UI dirender setelah mount agar tidak terjadi hydration mismatch.
 */
export default function PlannerApp() {
  const [mounted, setMounted] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    try {
      if (!getCurrentDemoUser()) {
        router.replace('/login');
        return;
      }
      setAuthorized(true);
    } catch {
      router.replace('/login');
    }
  }, [router]);

  if (!mounted || !authorized) return <div className="h-screen w-screen bg-[#F7FAFC]" />;

  return (
    <PlannerProvider>
      <AppShell />
    </PlannerProvider>
  );
}

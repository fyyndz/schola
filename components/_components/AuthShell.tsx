import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./auth.module.css";

type AuthShellProps = {
  title: string;
  subtitle: ReactNode;
  children: ReactNode;
};

export default function AuthShell({
  title,
  subtitle,
  children,
}: AuthShellProps) {
  return (
    <main className={styles.page}>
      <aside className={styles.visual} aria-hidden="true">
        <Image
          src="/images/study-planner.png"
          alt=""
          fill
          priority
          sizes="(max-width: 720px) 100vw, 42vw"
          className={styles.visualImage}
        />
      </aside>

      <section className={styles.content}>
        <div className={styles.formPanel}>
          <Link href="/" className={styles.formBrand} aria-label="Schola beranda">
            <Image src="/images/schola-brand.png" alt="Schola" width={211} height={73} priority />
          </Link>
          <div className={styles.mobileIllustration} aria-hidden="true">
            <Image src="/images/study-planner.png" alt="" width={610} height={1024} priority />
          </div>
          <header className={styles.header}>
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </header>
          {children}
        </div>
      </section>
    </main>
  );
}

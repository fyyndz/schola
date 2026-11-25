"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthShell from "../_components/AuthShell";
import PasswordInput from "../_components/PasswordInput";
import GoogleButton from "../_components/GoogleButton";
import styles from "../_components/auth.module.css";
import {
  demoCredentials,
  getCurrentDemoUser,
  getDemoAccountEmail,
  loginDemoAccount,
} from "@/lib/demo-auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [demoEmail, setDemoEmail] = useState(demoCredentials.email);
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      setDemoEmail(getDemoAccountEmail());
      if (getCurrentDemoUser()) router.replace("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sesi tidak dapat dibaca.");
    }
  }, [router]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await loginDemoAccount(email, password, remember);
      router.replace("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal masuk. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  function useDemoAccount() {
    setEmail(demoEmail);
    setPassword(demoCredentials.password);
    setError(null);
  }

  return (
    <AuthShell
      title="Selamat datang!"
      subtitle={<>Lanjutkan progres belajarmu dan selesaikan target hari ini.</>}
    >
      <form className={styles.form} onSubmit={onSubmit}>
        {error && <div className={styles.alert} role="alert">{error}</div>}

        <div className={styles.stack}>
          <input
            className={styles.input}
            type="email"
            name="email"
            placeholder="Email siswa"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(null);
            }}
          />
          <PasswordInput
            name="password"
            placeholder="Kata sandi"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(null);
            }}
          />
        </div>

        <div className={styles.metaRow}>
          <label className={styles.remember}>
            <input
              className={styles.checkbox}
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            Ingat saya
          </label>
          <button
            type="button"
            className={styles.textButton}
            onClick={() => setError("Fitur lupa kata sandi belum tersedia untuk akun demo.")}
          >
            Lupa kata sandi?
          </button>
        </div>

        <button type="submit" className={styles.submit} disabled={loading}>
          {loading ? "Memproses..." : "Masuk"}
        </button>
      </form>

      <div className={styles.demoHint}>
        <div>
          <strong>Akun demo</strong>
          <span>{demoEmail}</span>
          <span>Kata sandi: {demoCredentials.password}</span>
        </div>
        <button type="button" onClick={useDemoAccount}>
          Isi otomatis
        </button>
      </div>

      <div className={styles.divider}>atau</div>
      <GoogleButton />

      <div className={styles.footer}>
        Belum punya akun?
        <Link href="/register" className={styles.link}>Daftar sekarang</Link>
      </div>
    </AuthShell>
  );
}

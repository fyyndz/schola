"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthShell from "../_components/AuthShell";
import PasswordInput from "../_components/PasswordInput";
import GoogleButton from "../_components/GoogleButton";
import styles from "../_components/auth.module.css";
import { getCurrentDemoUser, logoutDemoAccount, registerDemoAccount } from "@/lib/demo-auth";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    kelas: "",
    sekolah: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      if (getCurrentDemoUser()) router.replace("/");
    } catch {
      // Biarkan halaman daftar ditampilkan jika sesi tidak dapat dibaca.
    }
  }, [router]);

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError(null);
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    setLoading(true);
    try {
      await registerDemoAccount({
        name: form.name,
        email: form.email,
        password: form.password,
        studentClass: form.kelas,
        school: form.sekolah,
      });
      logoutDemoAccount();
      router.replace("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mendaftar. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Buat akun baru!"
      subtitle={<>Atur jadwal pelajaran, tugas, dan fokus belajarmu dalam satu tempat.</>}
    >
      <form className={styles.form} onSubmit={onSubmit}>
        {error && <div className={styles.alert} role="alert">{error}</div>}

        <div className={styles.stack}>
          <input
            className={styles.input}
            name="name"
            placeholder="Nama lengkap (cth. Schola)"
            autoComplete="name"
            required
            value={form.name}
            onChange={onChange}
          />
          <div className={styles.row}>
            <input
              className={styles.input}
              name="kelas"
              placeholder="Kelas (XI IPA 2)"
              required
              value={form.kelas}
              onChange={onChange}
            />
            <input
              className={styles.input}
              name="sekolah"
              placeholder="Sekolah"
              required
              value={form.sekolah}
              onChange={onChange}
            />
          </div>
          <input
            className={styles.input}
            type="email"
            name="email"
            placeholder="Email siswa"
            autoComplete="email"
            required
            value={form.email}
            onChange={onChange}
          />
          <PasswordInput
            name="password"
            placeholder="Buat kata sandi"
            autoComplete="new-password"
            required
            value={form.password}
            onChange={onChange}
          />
        </div>

        <button
          type="submit"
          className={`${styles.submit} ${styles.submitAccent}`}
          disabled={loading}
        >
          {loading ? "Mendaftarkan..." : "Daftar"}
        </button>
      </form>

      <div className={styles.divider}>atau</div>
      <GoogleButton />

      <div className={styles.footer}>
        Sudah punya akun?
        <Link href="/login" className={styles.link}>Masuk di sini</Link>
      </div>
    </AuthShell>
  );
}

'use client';

import Image from 'next/image';
import { useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { usePlanner } from '@/context/PlannerContext';
import Field from '@/components/ui/Field';
import Modal from '@/components/ui/Modal';
import ModalActions from '@/components/ui/ModalActions';
import { inputCls } from '@/lib/styles';

export default function EditProfileModal() {
  const { profile, updateProfile, closeModal } = usePlanner();
  const [name, setName] = useState(profile.name);
  const [studentClass, setStudentClass] = useState(profile.studentClass);
  const [school, setSchool] = useState(profile.school);
  const [email, setEmail] = useState(profile.email);
  const [avatarDataUrl, setAvatarDataUrl] = useState(profile.avatarDataUrl ?? '');
  const [avatarFileName, setAvatarFileName] = useState('');
  const [avatarError, setAvatarError] = useState('');
  const [profileError, setProfileError] = useState('');
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    setAvatarFileName(file?.name ?? '');
    event.currentTarget.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setAvatarError('Pilih file gambar.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setAvatarError('Ukuran gambar maksimal 5 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        setAvatarError('Gambar tidak dapat dibaca. Coba pilih file lain.');
        return;
      }

      const image = new window.Image();
      image.onload = () => {
        const maxDimension = 512;
        const scale = Math.min(1, maxDimension / Math.max(image.naturalWidth, image.naturalHeight));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
        canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));

        const context = canvas.getContext('2d');
        if (!context) {
          setAvatarError('Foto tidak dapat diproses. Coba pilih gambar lain.');
          return;
        }

        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        try {
          setAvatarDataUrl(canvas.toDataURL('image/webp', 0.82));
          setAvatarError('');
        } catch {
          setAvatarError('Foto tidak dapat diproses. Coba pilih gambar lain.');
        }
      };
      image.onerror = () => setAvatarError('File ini bukan gambar yang dapat digunakan.');
      image.src = reader.result;
    };
    reader.onerror = () => setAvatarError('Gambar tidak dapat dibaca. Coba pilih file lain.');
    reader.readAsDataURL(file);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setProfileError('');
    try {
      updateProfile({
        name: name.trim(),
        studentClass: studentClass.trim(),
        school: school.trim(),
        email: email.trim(),
        avatarDataUrl: avatarDataUrl || undefined,
      });
      closeModal();
    } catch (error) {
      setProfileError(error instanceof Error ? error.message : 'Profil tidak dapat diperbarui.');
    }
  };

  return (
    <Modal title="Edit Profile Siswa" onClose={closeModal}>
      <form onSubmit={submit} className="space-y-4">
        {profileError && (
          <p role="alert" className="rounded-xl border border-[#791A0A]/20 bg-[#791A0A]/5 px-3 py-2 text-xs font-semibold text-[#791A0A]">
            {profileError}
          </p>
        )}
        <Field label="Nama Lengkap">
          <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
        </Field>
        <Field label="Kelas (Bisa diubah saat naik kelas)">
          <input
            type="text"
            required
            value={studentClass}
            onChange={(e) => setStudentClass(e.target.value)}
            placeholder="Contoh: XII IPA 1"
            className={inputCls}
          />
        </Field>
        <Field label="Sekolah">
          <input type="text" required value={school} onChange={(e) => setSchool(e.target.value)} className={inputCls} />
        </Field>
        <Field label="Email Siswa">
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
        </Field>
        <Field label="Foto Profil">
          <div className="flex items-center gap-3">
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full bg-[#052948]/10">
              {avatarDataUrl && (
                <Image
                  src={avatarDataUrl}
                  alt="Pratinjau foto profil"
                  width={64}
                  height={64}
                  unoptimized
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                aria-label="Pilih foto profil"
                className="hidden"
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  aria-describedby={avatarError ? 'avatar-error' : undefined}
                  className="shrink-0 rounded-full bg-[#052948]/10 px-3 py-2 text-xs font-bold text-[#052948] hover:bg-[#052948]/15"
                >
                  Pilih foto
                </button>
                <span className="min-w-0 break-all text-xs text-[#4D687D]">
                  {avatarFileName || (avatarDataUrl ? 'Foto profil tersimpan' : 'Belum ada file dipilih')}
                </span>
              </div>
              {avatarError && (
                <p id="avatar-error" role="alert" className="mt-1 text-[11px] font-semibold text-[#791A0A]">
                  {avatarError}
                </p>
              )}
            </div>
          </div>
          {avatarDataUrl && (
            <button
              type="button"
              onClick={() => {
                setAvatarDataUrl('');
                setAvatarFileName('');
              }}
              className="mt-2 text-xs font-bold text-[#791A0A] hover:underline"
            >
              Hapus foto
            </button>
          )}
        </Field>
        <ModalActions onCancel={closeModal} submitLabel="Simpan Perubahan" />
      </form>
    </Modal>
  );
}

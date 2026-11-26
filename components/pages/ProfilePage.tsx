'use client';

import Image from 'next/image';
import { ChevronDown, Contact, Pencil, SlidersHorizontal } from 'lucide-react';
import { usePlanner } from '@/context/PlannerContext';
import type { ProfileSwitchKey, RetentionUnit } from '@/lib/types';

const SWITCHES: { key: ProfileSwitchKey; title: string; desc: string }[] = [
  { key: 'notifDeadline', title: 'Notifikasi Deadline Tugas', desc: 'Ingatkan H-1 dan saat lewat batas waktu' },
  { key: 'notifSchedule', title: 'Pengingat Jadwal Pagi', desc: 'Ingatkan jadwal pelajaran setiap pagi' },
  { key: 'notifRoutine', title: 'Pengingat Belajar Rutin', desc: 'Notifikasi fokus belajar setiap malam' },
  { key: 'soundEffectsEnabled', title: 'Efek Suara', desc: 'Suara interaksi dan saat timer selesai' },
];

export default function ProfilePage() {
  const { profile, openModal, toggleProfileSwitch, retention, updateRetention } = usePlanner();
  const initials = profile.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const info: [string, string][] = [
    ['Nama Lengkap', profile.name],
    ['Kelas', profile.studentClass],
    ['Sekolah', profile.school],
    ['Email', profile.email],
    ['NIS', profile.nis],
  ];

  return (
    <>
      <div className="mb-5">
        <h1 className="text-2xl font-extrabold text-[#052948] tracking-tight">Profile</h1>
        <p className="text-xs font-semibold text-[#4D687D] mt-0.5">
          Kelola identitas siswa, data kelas, dan preferensi notifikasi
        </p>
      </div>

      {/* Header card */}
      <div className="bg-white rounded-[26px] p-5 border border-[#B3B9BF]/45 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4 mb-5">
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#052948] to-[#4D687D] text-xl font-extrabold text-white shadow-md">
            {profile.avatarDataUrl ? (
              <Image
                src={profile.avatarDataUrl}
                alt={`Foto profil ${profile.name}`}
                width={64}
                height={64}
                unoptimized
                className="h-full w-full object-cover"
              />
            ) : (
              initials
            )}
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-[#052948]">{profile.name}</h2>
            <p className="text-xs font-semibold text-[#4D687D] mt-0.5">
              <span className="text-[#052948] font-extrabold">{profile.studentClass}</span> • {profile.school}
            </p>
          </div>
        </div>
        <button
          onClick={() => openModal('editProfileModal')}
          className="px-5 py-2.5 rounded-full bg-[#052948] hover:bg-[#4D687D] text-white text-xs font-extrabold shadow-sm flex items-center gap-1.5"
        >
          <Pencil className="w-3.5 h-3.5" />
          <span>Edit Profile</span>
        </button>
      </div>

      <div className="schola-12-grid">
        {/* Account info */}
        <div className="col-span-12 xl:col-span-6 bg-white rounded-[24px] p-5 border border-[#B3B9BF]/45 shadow-2xs">
          <h3 className="text-sm font-extrabold text-[#052948] pb-3 border-b border-[#B3B9BF]/30 flex items-center gap-2">
            <Contact className="w-4 h-4 text-[#052948]" />
            <span>Informasi Akun</span>
          </h3>
          <div className="divide-y divide-[#B3B9BF]/25 text-xs mt-1">
            {info.map(([label, value]) => (
              <div key={label} className="py-3 flex justify-between gap-3">
                <span className="text-[#4D687D] font-semibold">{label}</span>
                <span className="font-extrabold text-[#052948] text-right">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Settings */}
        <div className="col-span-12 xl:col-span-6 bg-white rounded-[24px] p-5 border border-[#B3B9BF]/45 shadow-2xs">
          <h3 className="text-sm font-extrabold text-[#052948] pb-3 border-b border-[#B3B9BF]/30 flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#052948]" />
            <span>Pengaturan</span>
          </h3>
          <div className="space-y-4 mt-3.5 text-xs">
            {SWITCHES.map((s) => (
              <div key={s.key} className="flex items-center justify-between">
                <div>
                  <p className="font-extrabold text-[#052948]">{s.title}</p>
                  <p className="text-[11px] text-[#4D687D]">{s.desc}</p>
                </div>
                <button
                  role="switch"
                  aria-checked={profile[s.key]}
                  aria-label={s.title}
                  onClick={() => toggleProfileSwitch(s.key)}
                  className={`w-11 h-6 rounded-full p-1 transition-colors ${profile[s.key] ? 'bg-[#052948]' : 'bg-[#B3B9BF]'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${profile[s.key] ? 'translate-x-5' : ''}`} />
                </button>
              </div>
            ))}

            <div className="pt-3 border-t border-[#B3B9BF]/30">
              <p className="font-extrabold text-[#052948] mb-1.5">Pembersihan Otomatis Riwayat Tugas Selesai</p>
              <div className="flex items-center gap-2.5">
                <input
                  type="number"
                  min={1}
                  max={365}
                  value={retention.value}
                  onChange={(e) => updateRetention(parseInt(e.target.value, 10) || 1, null)}
                  className="w-16 px-3 py-2 rounded-xl border border-[#B3B9BF] text-center font-extrabold text-[#052948]"
                />
                <div className="relative flex-1">
                  <select
                    value={retention.unit}
                    onChange={(e) => updateRetention(null, e.target.value as RetentionUnit)}
                    className="appearance-none w-full pl-3.5 pr-9 py-2 rounded-xl border border-[#B3B9BF] bg-white font-bold text-[#052948] focus:border-[#052948] focus:outline-none cursor-pointer"
                  >
                    <option value="hours">Jam setelah selesai</option>
                    <option value="days">Hari setelah selesai</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#4D687D] pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

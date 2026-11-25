let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Context = window.AudioContext ??
    (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Context) return null;

  audioContext ??= new Context();
  return audioContext;
}

function tone(frequency: number, start: number, duration: number, volume = 0.08) {
  const context = getAudioContext();
  if (!context) return;

  if (context.state !== "running") {
    void context.resume()
      .then(() => scheduleTone(context, frequency, start, duration, volume))
      .catch(() => undefined);
    return;
  }

  scheduleTone(context, frequency, start, duration, volume);
}

function scheduleTone(
  context: AudioContext,
  frequency: number,
  start: number,
  duration: number,
  volume: number,
) {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.frequency.value = frequency;
  oscillator.type = "sine";
  gain.gain.setValueAtTime(volume, context.currentTime + start);
  gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + start + duration);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(context.currentTime + start);
  oscillator.stop(context.currentTime + start + duration);
}

export function playClickSound() {
  tone(520, 0, 0.06, 0.035);
}

export function playSuccessSound() {
  tone(660, 0, 0.09, 0.055);
  tone(880, 0.09, 0.12, 0.055);
}

export function playAlarmSound() {
  [0, 0.28, 0.56, 0.84, 1.12].forEach((start) => {
    tone(880, start, 0.16, 0.12);
  });
}

export async function requestStudyNotificationPermission(): Promise<boolean> {
  if (typeof window === "undefined" || !("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  return (await Notification.requestPermission()) === "granted";
}

export function showStudyNotification(title: string, body: string) {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission !== "granted") return;

  new Notification(title, {
    body,
    icon: "/images/schola-brand.png",
  });
}

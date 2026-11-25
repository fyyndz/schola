const ACCOUNTS_KEY = "schola.demo.accounts";
const REMEMBERED_SESSION_KEY = "schola.demo.remembered-session";
const SESSION_KEY = "schola.demo.session";
const PBKDF2_ITERATIONS = 120_000;
const LEGACY_DEMO_EMAIL = "leviona@schola.id";

type StoredAccount = {
  name: string;
  email: string;
  studentClass: string;
  school: string;
  salt: string;
  passwordHash: string;
};

export type DemoUser = Pick<
  StoredAccount,
  "name" | "email" | "studentClass" | "school"
>;

function isStoredAccount(value: unknown): value is StoredAccount {
  if (typeof value !== "object" || value === null) return false;
  return (
    "name" in value &&
    typeof value.name === "string" &&
    "email" in value &&
    typeof value.email === "string" &&
    "studentClass" in value &&
    typeof value.studentClass === "string" &&
    "school" in value &&
    typeof value.school === "string" &&
    "salt" in value &&
    typeof value.salt === "string" &&
    "passwordHash" in value &&
    typeof value.passwordHash === "string"
  );
}

export const demoCredentials = {
  name: "Schola",
  email: "schola@gmail.com",
  password: "schola_123",
  studentClass: "XI IPA 2",
  school: "SMA Schola",
};

function getAccounts(): StoredAccount[] {
  let serialized: string | null;
  try {
    serialized = window.localStorage.getItem(ACCOUNTS_KEY);
  } catch {
    throw new Error("Penyimpanan browser tidak tersedia. Coba buka aplikasi di browser biasa.");
  }

  if (!serialized) return [];

  try {
    const accounts: unknown = JSON.parse(serialized);
    if (!Array.isArray(accounts) || !accounts.every(isStoredAccount)) {
      throw new Error();
    }
    return accounts;
  } catch {
    throw new Error("Data akun demo rusak. Bersihkan data situs ini lalu coba lagi.");
  }
}

function saveAccounts(accounts: StoredAccount[]) {
  try {
    window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch {
    throw new Error("Akun tidak dapat disimpan di browser. Periksa ruang penyimpanan lalu coba lagi.");
  }
}

function toBase64(bytes: Uint8Array): string {
  return window.btoa(Array.from(bytes, (byte) => String.fromCharCode(byte)).join(""));
}

function fromBase64(value: string): Uint8Array {
  return Uint8Array.from(window.atob(value), (character) => character.charCodeAt(0));
}

async function hashPassword(password: string, salt: Uint8Array): Promise<string> {
  if (!window.crypto?.subtle) {
    throw new Error("Browser ini belum mendukung penyimpanan akun demo yang aman.");
  }

  const key = await window.crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const saltBuffer = new ArrayBuffer(salt.byteLength);
  new Uint8Array(saltBuffer).set(salt);
  const bits = await window.crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: saltBuffer,
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-256",
    },
    key,
    256,
  );
  return toBase64(new Uint8Array(bits));
}

function equalHash(left: string, right: string): boolean {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return difference === 0;
}

function toDemoUser(account: StoredAccount): DemoUser {
  return {
    name:
      account.email === normalizeEmail(demoCredentials.email)
        ? demoCredentials.name
        : account.name,
    email: account.email,
    studentClass: account.studentClass,
    school: account.school,
  };
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

async function ensureDemoAccount(): Promise<StoredAccount[]> {
  const storedAccounts = getAccounts();
  const accounts = storedAccounts.filter(
    (account) => account.email !== LEGACY_DEMO_EMAIL,
  );
  if (accounts.length !== storedAccounts.length) {
    saveAccounts(accounts);
  }
  const demoEmail = normalizeEmail(demoCredentials.email);
  const existingDemoAccount = accounts.find((account) => account.email === demoEmail);
  if (existingDemoAccount) {
    if (existingDemoAccount.name !== demoCredentials.name) {
      existingDemoAccount.name = demoCredentials.name;
      saveAccounts(accounts);
    }
    return accounts;
  }

  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  accounts.push({
    name: demoCredentials.name,
    email: demoEmail,
    studentClass: demoCredentials.studentClass,
    school: demoCredentials.school,
    salt: toBase64(salt),
    passwordHash: await hashPassword(demoCredentials.password, salt),
  });
  saveAccounts(accounts);
  return accounts;
}

function saveSession(email: string, remember: boolean) {
  try {
    if (remember) {
      window.localStorage.setItem(REMEMBERED_SESSION_KEY, email);
      window.sessionStorage.removeItem(SESSION_KEY);
    } else {
      window.sessionStorage.setItem(SESSION_KEY, email);
      window.localStorage.removeItem(REMEMBERED_SESSION_KEY);
    }
  } catch {
    throw new Error("Sesi tidak dapat disimpan di browser. Periksa pengaturan penyimpanan situs.");
  }
}

export async function loginDemoAccount(
  email: string,
  password: string,
  remember: boolean,
): Promise<DemoUser> {
  const accounts = await ensureDemoAccount();
  const normalizedEmail = normalizeEmail(email);
  const account = accounts.find((item) => item.email === normalizedEmail);

  if (!account) {
    throw new Error("Email ini belum terdaftar. Silakan buat akun terlebih dahulu.");
  }

  const submittedHash = await hashPassword(password, fromBase64(account.salt));
  if (!equalHash(submittedHash, account.passwordHash)) {
    throw new Error("Kata sandi salah. Periksa kembali atau gunakan akun demo.");
  }

  saveSession(account.email, remember);
  return toDemoUser(account);
}

export async function registerDemoAccount(input: {
  name: string;
  email: string;
  password: string;
  studentClass: string;
  school: string;
}): Promise<DemoUser> {
  const accounts = await ensureDemoAccount();
  const email = normalizeEmail(input.email);
  if (accounts.some((account) => account.email === email)) {
    throw new Error("Email ini sudah terdaftar. Silakan masuk atau gunakan email lain.");
  }

  if (input.password.length < 8) {
    throw new Error("Kata sandi minimal 8 karakter.");
  }

  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const account: StoredAccount = {
    name: input.name.trim(),
    email,
    studentClass: input.studentClass.trim(),
    school: input.school.trim(),
    salt: toBase64(salt),
    passwordHash: await hashPassword(input.password, salt),
  };
  accounts.push(account);
  saveAccounts(accounts);
  saveSession(account.email, true);
  return toDemoUser(account);
}

export function getCurrentDemoUser(): DemoUser | null {
  let email: string | null;
  try {
    email =
      window.localStorage.getItem(REMEMBERED_SESSION_KEY) ??
      window.sessionStorage.getItem(SESSION_KEY);
  } catch {
    throw new Error("Sesi tidak dapat dibaca dari penyimpanan browser.");
  }
  if (!email) return null;
  if (email === LEGACY_DEMO_EMAIL) {
    logoutDemoAccount();
    return null;
  }

  const account = getAccounts().find((item) => item.email === email);
  return account ? toDemoUser(account) : null;
}

export function logoutDemoAccount() {
  try {
    window.localStorage.removeItem(REMEMBERED_SESSION_KEY);
    window.sessionStorage.removeItem(SESSION_KEY);
  } catch {
    throw new Error("Sesi tidak dapat dihapus dari browser. Coba lagi.");
  }
}

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { changeDemoAccountEmail, getDemoAccountEmail } from './demo-auth';

const storageValues = new Map<string, string>();
const makeStorage = (): Storage => ({
  get length() {
    return storageValues.size;
  },
  clear: () => storageValues.clear(),
  getItem: (key) => storageValues.get(key) ?? null,
  key: (index) => Array.from(storageValues.keys())[index] ?? null,
  removeItem: (key) => storageValues.delete(key),
  setItem: (key, value) => storageValues.set(key, value),
});

const originalWindow = globalThis.window;

describe('demo account email changes', () => {
  beforeEach(() => {
    storageValues.clear();
    Object.defineProperty(globalThis, 'window', {
      configurable: true,
      value: {
        localStorage: makeStorage(),
        sessionStorage: makeStorage(),
      },
    });
    storageValues.set(
      'schola.demo.accounts',
      JSON.stringify([
        {
          name: 'Schola',
          email: 'schola@gmail.com',
          studentClass: 'XI IPA 2',
          school: 'SMA Schola',
          salt: 'salt',
          passwordHash: 'hash',
          isDemo: true,
        },
      ]),
    );
    storageValues.set('schola.demo.remembered-session', 'schola@gmail.com');
  });

  afterEach(() => {
    Object.defineProperty(globalThis, 'window', {
      configurable: true,
      value: originalWindow,
    });
  });

  it('updates the account, remembered session, and demo account hint', () => {
    expect(changeDemoAccountEmail('schola@gmail.com', 'student@example.com')).toBe(
      'student@example.com',
    );

    const accounts = JSON.parse(storageValues.get('schola.demo.accounts') ?? '[]');
    expect(accounts[0].email).toBe('student@example.com');
    expect(accounts[0].isDemo).toBe(true);
    expect(storageValues.get('schola.demo.remembered-session')).toBe('student@example.com');
    expect(getDemoAccountEmail()).toBe('student@example.com');
  });

  it('rejects an email already used by another account', () => {
    const accounts = JSON.parse(storageValues.get('schola.demo.accounts') ?? '[]');
    accounts.push({ ...accounts[0], email: 'used@example.com', isDemo: false });
    storageValues.set('schola.demo.accounts', JSON.stringify(accounts));

    expect(() => changeDemoAccountEmail('schola@gmail.com', 'used@example.com')).toThrow(
      'Email ini sudah digunakan akun lain.',
    );
    expect(storageValues.get('schola.demo.remembered-session')).toBe('schola@gmail.com');
  });
});

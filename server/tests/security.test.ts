import { encryptSecret, decryptSecret, maskSecret } from '../src/security/crypto';

describe('AES-256-GCM Security Encryption Module', () => {
  it('should encrypt and decrypt a bot token correctly', () => {
    const rawToken = 'MySuperSecureMockTokenForTestingOnly1234567890';
    const encrypted = encryptSecret(rawToken);

    expect(encrypted).not.toBe(rawToken);
    expect(typeof encrypted).toBe('string');

    const decrypted = decryptSecret(encrypted);
    expect(decrypted).toBe(rawToken);
  });

  it('should mask sensitive bot secrets for logging and UI', () => {
    const secret = 'MTAxMjM0NTY3ODkwMTIzNDU2Nw';
    const masked = maskSecret(secret);
    expect(masked).toBe('MTAx...U2Nw');
  });
});

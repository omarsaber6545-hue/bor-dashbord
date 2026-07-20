"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("../src/security/crypto");
describe('AES-256-GCM Security Encryption Module', () => {
    it('should encrypt and decrypt a bot token correctly', () => {
        const rawToken = 'MySuperSecureMockTokenForTestingOnly1234567890';
        const encrypted = (0, crypto_1.encryptSecret)(rawToken);
        expect(encrypted).not.toBe(rawToken);
        expect(typeof encrypted).toBe('string');
        const decrypted = (0, crypto_1.decryptSecret)(encrypted);
        expect(decrypted).toBe(rawToken);
    });
    it('should mask sensitive bot secrets for logging and UI', () => {
        const secret = 'MTAxMjM0NTY3ODkwMTIzNDU2Nw';
        const masked = (0, crypto_1.maskSecret)(secret);
        expect(masked).toBe('MTAx...U2Nw');
    });
});

const crypto = require('crypto');

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // 12 bytes standard for GCM

if (!process.env.ENCRYPTION_KEY) {
  throw new Error('FATAL ERROR: ENCRYPTION_KEY environment variable is not defined.');
}

// Derive 32-byte key from ENCRYPTION_KEY env variable to prevent size errors
const getSecretKey = () => {
  const secret = process.env.ENCRYPTION_KEY;
  if (!secret) {
    throw new Error('FATAL ERROR: ENCRYPTION_KEY environment variable is not defined.');
  }
  return crypto.createHash('sha256').update(secret).digest();
};

/**
 * Encrypts cleartext using AES-256-GCM.
 * @param {string} text - Plain text to encrypt.
 * @returns {string} Encrypted string in format hex(iv):hex(ciphertext):hex(tag).
 */
const encrypt = (text) => {
  if (text === null || text === undefined || typeof text !== 'string') return text;
  try {
    const key = getSecretKey();
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const tag = cipher.getAuthTag().toString('hex');
    
    return `${iv.toString('hex')}:${encrypted}:${tag}`;
  } catch (err) {
    console.error('Encryption helper error:', err.message);
    return text;
  }
};

/**
 * Decrypts AES-256-GCM ciphertext.
 * @param {string} ciphertext - Encrypted string.
 * @returns {string} Decrypted plaintext.
 */
const decrypt = (ciphertext) => {
  if (!ciphertext || typeof ciphertext !== 'string') return ciphertext;
  try {
    const parts = ciphertext.split(':');
    if (parts.length !== 3) {
      // Plain text or legacy format fallback
      return ciphertext;
    }
    
    const iv = Buffer.from(parts[0], 'hex');
    const encryptedText = parts[1];
    const tag = Buffer.from(parts[2], 'hex');
    
    const key = getSecretKey();
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);
    
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (err) {
    console.error('Decryption helper error (returning ciphertext):', err.message);
    return ciphertext;
  }
};

module.exports = {
  encrypt,
  decrypt
};

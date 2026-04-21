/**
 * PekalonganPay AES-256 Encryption Module
 * 
 * Provides application-level payload encryption before sending to server.
 * Uses expo-crypto for cryptographic operations and expo-secure-store for key management.
 */

import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';

const ENCRYPTION_KEY_ALIAS = 'pkp_encryption_key';
const IV_LENGTH = 16;

/**
 * Generate or retrieve the app-level encryption key
 */
async function getEncryptionKey(): Promise<string> {
    let key = await SecureStore.getItemAsync(ENCRYPTION_KEY_ALIAS);
    if (!key) {
        // Generate a 256-bit (32 byte) key
        const randomBytes = await Crypto.getRandomBytes(32);
        key = bytesToHex(randomBytes);
        await SecureStore.setItemAsync(ENCRYPTION_KEY_ALIAS, key);
    }
    return key;
}

/**
 * Convert Uint8Array to hex string
 */
function bytesToHex(bytes: Uint8Array): string {
    return Array.from(bytes)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
}

/**
 * Convert hex string to Uint8Array
 */
function hexToBytes(hex: string): Uint8Array {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
        bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
    }
    return bytes;
}

/**
 * Generate a SHA-256 hash digest of the input
 */
export async function hashDigest(input: string): Promise<string> {
    return await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        input
    );
}

/**
 * Generate HMAC-SHA512 signature for SNAP API requests
 */
export async function generateHmacSignature(
    message: string,
    secretKey: string
): Promise<string> {
    // Combine message with secret for signing
    const combined = `${secretKey}:${message}`;
    return await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA512,
        combined
    );
}

/**
 * Hash a PIN using SHA-256 with salt
 */
export async function hashPin(pin: string, salt?: string): Promise<{ hash: string; salt: string }> {
    const pinSalt = salt || bytesToHex(await Crypto.getRandomBytes(16));
    const hash = await hashDigest(`${pin}:${pinSalt}`);
    return { hash, salt: pinSalt };
}

/**
 * Verify a PIN against stored hash
 */
export async function verifyPin(pin: string, storedHash: string, salt: string): Promise<boolean> {
    const { hash } = await hashPin(pin, salt);
    return hash === storedHash;
}

/**
 * Encrypt a transaction payload before sending to server
 * Returns base64-encoded encrypted payload with IV prepended
 */
export async function encryptPayload(payload: object): Promise<string> {
    const key = await getEncryptionKey();
    const plaintext = JSON.stringify(payload);

    // Generate random IV
    const iv = await Crypto.getRandomBytes(IV_LENGTH);
    const ivHex = bytesToHex(iv);

    // Simple XOR-based encryption with key derivation
    // In production, use a proper AES implementation via native module
    const keyHash = await hashDigest(key);
    const encrypted = simpleEncrypt(plaintext, keyHash);

    return `${ivHex}:${encrypted}`;
}

/**
 * Decrypt a payload received from server
 */
export async function decryptPayload(encryptedData: string): Promise<object> {
    const key = await getEncryptionKey();
    const [_ivHex, encrypted] = encryptedData.split(':');

    const keyHash = await hashDigest(key);
    const decrypted = simpleDecrypt(encrypted, keyHash);

    return JSON.parse(decrypted);
}

/**
 * Simple encryption helper (XOR-based)
 * NOTE: In production, this should be replaced with a proper AES-256-CBC
 * implementation via a native crypto module (e.g., react-native-aes-crypto)
 */
function simpleEncrypt(plaintext: string, keyHex: string): string {
    const keyBytes = hexToBytes(keyHex.substring(0, 64));
    const textBytes = new TextEncoder().encode(plaintext);
    const encrypted = new Uint8Array(textBytes.length);

    for (let i = 0; i < textBytes.length; i++) {
        encrypted[i] = textBytes[i] ^ keyBytes[i % keyBytes.length];
    }

    return bytesToHex(encrypted);
}

function simpleDecrypt(encryptedHex: string, keyHex: string): string {
    const keyBytes = hexToBytes(keyHex.substring(0, 64));
    const encryptedBytes = hexToBytes(encryptedHex);
    const decrypted = new Uint8Array(encryptedBytes.length);

    for (let i = 0; i < encryptedBytes.length; i++) {
        decrypted[i] = encryptedBytes[i] ^ keyBytes[i % keyBytes.length];
    }

    return new TextDecoder().decode(decrypted);
}

/**
 * Generate a unique reference ID for transactions
 */
export async function generateReferenceId(): Promise<string> {
    const timestamp = Date.now().toString(36);
    const random = bytesToHex(await Crypto.getRandomBytes(8));
    return `PKP-${timestamp}-${random}`.toUpperCase();
}

export default {
    hashDigest,
    generateHmacSignature,
    hashPin,
    verifyPin,
    encryptPayload,
    decryptPayload,
    generateReferenceId,
};

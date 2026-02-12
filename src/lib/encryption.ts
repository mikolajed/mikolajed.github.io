import nacl from "tweetnacl";
import { decodeBase64, encodeBase64, decodeUTF8, encodeUTF8 } from "tweetnacl-util";
import { ENC_PREFIX } from "./constants";

// ─── Key Derivation ──────────────────────────────────────────────────

/** Convert a hex string (with or without 0x prefix) to Uint8Array. */
function hexToBytes(hex: string): Uint8Array {
  const clean = hex.startsWith("0x") ? hex.slice(2) : hex;
  const bytes = new Uint8Array(clean.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(clean.substr(i * 2, 2), 16);
  }
  return bytes;
}

/**
 * Derive an X25519 keypair from a wallet signature.
 * signature → SHA-256 → 32 bytes → nacl.box.keyPair.fromSecretKey()
 *
 * The same wallet + same message always produces the same keypair.
 */
export async function deriveKeyFromSignature(
  signature: string
): Promise<{ publicKey: Uint8Array; secretKey: Uint8Array; publicKeyB64: string }> {
  const sigBytes = hexToBytes(signature);
  const hashBuffer = await crypto.subtle.digest("SHA-256", sigBytes.buffer as ArrayBuffer);
  const seed = new Uint8Array(hashBuffer);
  const keyPair = nacl.box.keyPair.fromSecretKey(seed);

  return {
    publicKey: keyPair.publicKey,
    secretKey: keyPair.secretKey,
    publicKeyB64: encodeBase64(keyPair.publicKey),
  };
}

// ─── Encryption ──────────────────────────────────────────────────────

/**
 * Encrypt a plaintext message using a public key (fetched from contract).
 * Uses NaCl box (X25519-XSalsa20-Poly1305).
 *
 * Output format: "[ENC:v1]" + base64( nonce ‖ ephemeralPubKey ‖ ciphertext )
 */
export function encryptForDeployer(plaintext: string, publicKey: Uint8Array): string {
  const ephemeral = nacl.box.keyPair();
  const nonce = nacl.randomBytes(nacl.box.nonceLength);
  const messageBytes = decodeUTF8(plaintext);

  const ciphertext = nacl.box(messageBytes, nonce, publicKey, ephemeral.secretKey);

  if (!ciphertext) {
    throw new Error("Encryption failed");
  }

  const packed = new Uint8Array(nonce.length + ephemeral.publicKey.length + ciphertext.length);
  packed.set(nonce, 0);
  packed.set(ephemeral.publicKey, nonce.length);
  packed.set(ciphertext, nonce.length + ephemeral.publicKey.length);

  return ENC_PREFIX + encodeBase64(packed);
}

// ─── Decryption ──────────────────────────────────────────────────────

/**
 * Check if a guestbook message is encrypted.
 */
export function isEncryptedEntry(message: string): boolean {
  return message.startsWith(ENC_PREFIX);
}

/**
 * Decrypt an encrypted guestbook entry using a derived secret key.
 * The secret key is obtained at runtime via deriveKeyFromSignature().
 */
export function decryptMessage(
  encryptedMessage: string,
  secretKey: Uint8Array
): string | null {
  if (!encryptedMessage.startsWith(ENC_PREFIX)) return null;

  try {
    const packed = decodeBase64(encryptedMessage.slice(ENC_PREFIX.length));
    const nonce = packed.slice(0, nacl.box.nonceLength);
    const ephemeralPubKey = packed.slice(
      nacl.box.nonceLength,
      nacl.box.nonceLength + nacl.box.publicKeyLength
    );
    const ciphertext = packed.slice(nacl.box.nonceLength + nacl.box.publicKeyLength);

    const plaintext = nacl.box.open(ciphertext, nonce, ephemeralPubKey, secretKey);
    if (!plaintext) return null;

    return encodeUTF8(plaintext);
  } catch {
    return null;
  }
}

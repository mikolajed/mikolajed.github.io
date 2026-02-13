// ─── App-wide constants ──────────────────────────────────────────────
// Set DEBUG to true for local Anvil development, false for production (Sepolia).
export const DEBUG = false;

// ─── Deployer ────────────────────────────────────────────────────────
export const DEPLOYER_ADDRESS = "0x05d56624e386fdf92c30c85c69a10ccfc82e0aa5";

// ─── Encryption ──────────────────────────────────────────────────────
// Deterministic message the deployer signs to derive their X25519 keypair.
// Changing this message will generate a different keypair!
export const DECRYPT_SIGN_MESSAGE = "mikolajed.github.io:guestbook:decrypt-v1";

export const ENC_PREFIX = "[ENC:v1]";

// ─── APIs ────────────────────────────────────────────────────────
export const BLOG_API_URL = "https://blog-api.mikolajed.workers.dev";

// Platata browser dashboard — pure protocol + crypto (Part C).
// No DOM. Works in the browser and in Node (node:test) via globalThis.crypto.subtle.
// Standard primitives only (SPEC §2): ECDH P-256, HKDF-SHA256, AES-256-GCM with a
// counter nonce, HMAC-SHA256, PBKDF2-HMAC-SHA256. Byte conventions are pinned in
// docs/dashboard/snapshot-shape.md and cross-checked by site/tests/dashboard.test.js
// against Node's own crypto (an independent oracle).

// ONE config line for the relay (placeholder until deploy). The WebSocket URL and the
// short-code HTTP URL are both derived from this single line.
export const RELAY_BASE = "https://platata-dash-relay-462964824089.us-central1.run.app";

export const DASH_VERSION = "1";
export const DASH_PREFIX = "platata-dash";
export const SESSION_ID_BYTES = 16;
export const LINK_SECRET_BYTES = 32;
export const LINK_ID_BYTES = 32;
export const INFO_PREFIX = "platata-dash-v1|";
export const NONCE_BYTES = 12;
export const COUNTER_BYTES = 8;
export const GCM_TAG_BITS = 128;
export const PBKDF2_ITERATIONS = 100000;
export const QR_ROTATE_SECONDS = 20;
export const QR_STOP_AFTER = 5;
export const SILENT_AFTER_SECONDS = 15;
export const MAX_FRAME_BYTES = 256 * 1024;

// Base32 alphabet without I, O, 0 and 1 (the 8-character code path, SPEC §1).
export const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
export const CODE_LENGTH = 8;

// The ONLY message types the browser may ever send (SPEC §0 / §4). Everything else is
// refused before it is encrypted. Pinned by site/tests/dashboard.test.js.
export const ALLOWED_OUTBOUND = Object.freeze(["hello", "ping", "want"]);
export const ALLOWED_WANT_RANGES = Object.freeze([
  "TODAY", "YESTERDAY", "THIS_WEEK", "THIS_MONTH", "LAST_MONTH", "THIS_YEAR", "LAST_YEAR",
]);

const subtle = () => globalThis.crypto.subtle;
const te = new TextEncoder();
const td = new TextDecoder();

// ── bytes / base64url (no padding, per SPEC §2) ──────────────────────────────
export function concat(...arrays) {
  let len = 0;
  for (const a of arrays) len += a.length;
  const out = new Uint8Array(len);
  let off = 0;
  for (const a of arrays) { out.set(a, off); off += a.length; }
  return out;
}

export function randomBytes(n) {
  const out = new Uint8Array(n);
  globalThis.crypto.getRandomValues(out);
  return out;
}

export function toBase64Url(bytes) {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function fromBase64Url(str) {
  const s = str.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(s + "=".repeat((4 - (s.length % 4)) % 4));
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export function utf8(str) {
  return te.encode(str);
}

export function utf8Decode(bytes) {
  return td.decode(bytes);
}

// Constant-time comparison for the link mac.
export function constantTimeEqual(a, b) {
  if (a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a[i] ^ b[i];
  return d === 0;
}

// ── identity key + session material ─────────────────────────────────────────
export function generateSessionId() { return randomBytes(SESSION_ID_BYTES); }
export function generateLinkSecret() { return randomBytes(LINK_SECRET_BYTES); }
export function generateLinkId() { return randomBytes(LINK_ID_BYTES); }

// Non-extractable private key (SPEC: extractable = false), stored in IndexedDB later.
export async function generateIdentityKeyPair() {
  return await subtle().generateKey(
    { name: "ECDH", namedCurve: "P-256" },
    false,
    ["deriveBits"],
  );
}

export async function exportPublicRaw(publicKey) {
  return new Uint8Array(await subtle().exportKey("raw", publicKey));
}

export async function importPublicRaw(bytes) {
  return await subtle().importKey(
    "raw", bytes, { name: "ECDH", namedCurve: "P-256" }, false, [],
  );
}

// Z = ECDH(priv, peerPub) → 32 bytes.
export async function ecdh(privateKey, peerPublicKey) {
  const bits = await subtle().deriveBits(
    { name: "ECDH", public: peerPublicKey }, privateKey, 256,
  );
  return new Uint8Array(bits);
}

// HKDF-SHA256. info is built from the ASCII "platata-dash-v1|" + the raw sessionId bytes.
export async function hkdfSha256(ikm, salt, info, lengthBytes) {
  const key = await subtle().importKey("raw", ikm, "HKDF", false, ["deriveBits"]);
  const bits = await subtle().deriveBits(
    { name: "HKDF", hash: "SHA-256", salt, info }, key, lengthBytes * 8,
  );
  return new Uint8Array(bits);
}

async function aesGcmKey(raw) {
  return await subtle().importKey("raw", raw, { name: "AES-GCM" }, false, ["encrypt", "decrypt"]);
}

// K = HKDF-SHA256(ikm = Z, salt = linkSecret, info = "platata-dash-v1|" + sessionId, 64)
//   → kPhoneToBrowser (first 32) + kBrowserToPhone (last 32).
export async function deriveSessionKeys(z, salt, sessionId) {
  const info = concat(utf8(INFO_PREFIX), sessionId);
  const okm = await hkdfSha256(z, salt, info, 64);
  return {
    kPhoneToBrowser: await aesGcmKey(okm.slice(0, 32)),
    kBrowserToPhone: await aesGcmKey(okm.slice(32, 64)),
  };
}

// mac = HMAC-SHA256(secret, sessionId | browserPub | phonePub).
export async function linkMac(secret, sessionId, browserPub, phonePub) {
  const key = await subtle().importKey(
    "raw", secret, { name: "HMAC", hash: "SHA-256" }, false, ["sign"],
  );
  const sig = await subtle().sign("HMAC", key, concat(sessionId, browserPub, phonePub));
  return new Uint8Array(sig);
}

export async function linkMacValid(secret, sessionId, browserPub, phonePub, mac) {
  return constantTimeEqual(await linkMac(secret, sessionId, browserPub, phonePub), mac);
}

// 8-character code path: linkSecret = PBKDF2-HMAC-SHA256(code, salt = sessionId, 100000, 32).
export async function pbkdf2LinkSecret(code, sessionId) {
  const key = await subtle().importKey(
    "raw", utf8(code), "PBKDF2", false, ["deriveBits"],
  );
  const bits = await subtle().deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt: sessionId, iterations: PBKDF2_ITERATIONS },
    key, 256,
  );
  return new Uint8Array(bits);
}

export function isValidShortCode(code) {
  if (typeof code !== "string" || code.length !== CODE_LENGTH) return false;
  for (const ch of code) if (!CODE_ALPHABET.includes(ch)) return false;
  return true;
}

// ── AES-256-GCM frames ───────────────────────────────────────────────────────
// 12-byte nonce = 4 zero bytes + 8-byte big-endian counter, starting at 1. AAD = sessionId.
export function counterNonce(counter) {
  const out = new Uint8Array(NONCE_BYTES);
  for (let i = 0; i < COUNTER_BYTES; i++) {
    out[4 + i] = Math.floor(counter / 2 ** (8 * (COUNTER_BYTES - 1 - i))) & 0xff;
  }
  return out;
}

export async function encryptFrame(key, counter, aad, payloadBytes) {
  const ciphertext = await subtle().encrypt(
    { name: "AES-GCM", iv: counterNonce(counter), additionalData: aad, tagLength: GCM_TAG_BITS },
    key, payloadBytes,
  );
  return new Uint8Array(ciphertext);
}

// Throws (OperationError) on a wrong tag; a repeated or lower counter must be dropped by the caller.
export async function decryptFrame(key, counter, aad, ciphertext) {
  const plaintext = await subtle().decrypt(
    { name: "AES-GCM", iv: counterNonce(counter), additionalData: aad, tagLength: GCM_TAG_BITS },
    key, ciphertext,
  );
  return new Uint8Array(plaintext);
}

// ── QR text ──────────────────────────────────────────────────────────────────
// platata-dash:1:<sessionId>:<browserPub>:<linkSecret> — all base64url, no padding.
export function makeQrText(sessionId, browserPub, linkSecret) {
  return `${DASH_PREFIX}:${DASH_VERSION}:${toBase64Url(sessionId)}:${toBase64Url(browserPub)}:${toBase64Url(linkSecret)}`;
}

export function parseQrText(text) {
  const parts = String(text).split(":");
  if (parts.length !== 5 || parts[0] !== DASH_PREFIX || parts[1] !== DASH_VERSION) return null;
  const sessionId = fromBase64Url(parts[2]);
  const browserPub = fromBase64Url(parts[3]);
  const linkSecret = fromBase64Url(parts[4]);
  if (sessionId.length !== SESSION_ID_BYTES) return null;
  if (browserPub.length !== 65) return null;
  if (linkSecret.length !== LINK_SECRET_BYTES) return null;
  return { sessionId, browserPub, linkSecret };
}

// ── outgoing allow-list ──────────────────────────────────────────────────────
// Returns the message object to send, or null when the type is not allowed. The browser may
// send ONLY hello, ping and want (SPEC §4); want is only for the Reports tab with a known range.
export function sanitizeOutbound(type, fields = {}) {
  if (!ALLOWED_OUTBOUND.includes(type)) return null;
  if (type === "hello") {
    return { t: "hello", browser: String(fields.browser || ""), os: String(fields.os || "") };
  }
  if (type === "ping") return { t: "ping" };
  if (type === "want") {
    if (fields.tab !== "reports") return null;
    if (!ALLOWED_WANT_RANGES.includes(fields.range)) return null;
    return { t: "want", tab: "reports", range: fields.range };
  }
  return null;
}

// ── relay URLs (derived from the ONE RELAY_BASE line) ────────────────────────
export function relayWsUrl(sessionId) {
  return `${RELAY_BASE.replace(/^https:/, "wss:")}/v1/s/${toBase64Url(sessionId)}?role=browser`;
}

export function relayCodeUrl() {
  return `${RELAY_BASE}/v1/code`;
}

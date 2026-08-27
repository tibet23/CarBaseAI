/**
 * Enterprise client-side AES-GCM encryption for cloud backup & data privacy.
 * Data is encrypted with a master password / key before leaving the browser.
 */

async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encryptData(plainText: string, password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(password, salt);

  const enc = new TextEncoder();
  const encryptedContent = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv },
    key,
    enc.encode(plainText)
  );

  // Combine salt + iv + ciphertext
  const combined = new Uint8Array(salt.length + iv.length + encryptedContent.byteLength);
  combined.set(salt, 0);
  combined.set(iv, salt.length);
  combined.set(new Uint8Array(encryptedContent), salt.length + iv.length);

  // Convert to base64
  let binary = '';
  const len = combined.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(combined[i]);
  }
  return btoa(binary);
}

export async function decryptData(encryptedBase64: string, password: string): Promise<string> {
  try {
    const binary = atob(encryptedBase64);
    const combined = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      combined[i] = binary.charCodeAt(i);
    }

    const salt = combined.slice(0, 16);
    const iv = combined.slice(16, 28);
    const ciphertext = combined.slice(28);

    const key = await deriveKey(password, salt);
    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      ciphertext
    );

    const dec = new TextDecoder();
    return dec.decode(decryptedBuffer);
  } catch (error) {
    throw new Error('Failed to decrypt data. Invalid password or corrupted backup file.');
  }
}

export async function computeChecksum(text: string): Promise<string> {
  const enc = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest('SHA-256', enc.encode(text));
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

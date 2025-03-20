const key = "my-secret-key123";

export async function encryptAndSplit(input) {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);

  const iv = crypto.getRandomValues(new Uint8Array(12)); // Initialization vector
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(key),
    { name: "AES-GCM" },
    false,
    ["encrypt"]
  );

  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv },
    keyMaterial,
    data
  );

  const encryptedArray = Array.from(new Uint8Array(encryptedBuffer));
  const encryptedHex = encryptedArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  const ivHex = Array.from(iv)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const partSize = Math.ceil(encryptedHex.length / 2);
  return {
    iv: ivHex,
    part1: encryptedHex.slice(0, partSize),
    part2: encryptedHex.slice(partSize),
  };
}

export async function decrypt(parts) {
  const { iv, part1, part2 } = parts;
  const encryptedHex = part1 + part2;

  const ivArray = new Uint8Array(
    iv.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
  );
  const encryptedArray = new Uint8Array(
    encryptedHex.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
  );

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(key),
    { name: "AES-GCM" },
    false,
    ["decrypt"]
  );

  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: ivArray },
    keyMaterial,
    encryptedArray
  );

  return new TextDecoder().decode(decryptedBuffer);
}

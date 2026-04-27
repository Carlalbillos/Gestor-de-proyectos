export function uuidv7(): string {
  const timestamp = Date.now();
  const tsHex = timestamp.toString(16).padStart(12, '0');
  
  const random = new Uint8Array(10);
  crypto.getRandomValues(random);
  
  // Set version 7 (0111)
  random[0] = (random[0] & 0x0f) | 0x70;
  
  // Set variant (10xx)
  random[2] = (random[2] & 0x3f) | 0x80;

  const r = Array.from(random, b => b.toString(16).padStart(2, '0')).join('');

  return `${tsHex.slice(0, 8)}-${tsHex.slice(8, 12)}-${r.slice(0, 4)}-${r.slice(4, 8)}-${r.slice(8, 20)}`;
}

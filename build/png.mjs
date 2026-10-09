// Chromium renders in sRGB. Add explicit PNG metadata without changing pixels.
export function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let i = 0; i < 8; i++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}
export function tagSRGB(png) {
  if (!png.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) throw new Error('Not a PNG');
  if (png.readUInt32BE(8) !== 13 || png.toString('ascii',12,16) !== 'IHDR' || png[24] !== 8 || png[25] !== 2 || png[28] !== 0) throw new Error('Expected opaque 8-bit RGB, non-interlaced PNG');
  const chunk = Buffer.alloc(13);
  chunk.writeUInt32BE(1,0); chunk.write('sRGB',4,'ascii'); chunk[8] = 0;
  chunk.writeUInt32BE(crc32(chunk.subarray(4,9)),9);
  const parts = [png.subarray(0,33),chunk];
  for (let offset = 33; offset < png.length;) {
    const end = offset + png.readUInt32BE(offset) + 12;
    if (end > png.length) throw new Error('Truncated PNG');
    const type = png.toString('ascii',offset+4,offset+8);
    if (!['sRGB','iCCP','gAMA','cHRM'].includes(type)) parts.push(png.subarray(offset,end));
    offset = end;
  }
  return Buffer.concat(parts);
}

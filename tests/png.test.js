import { it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { crc32, tagSRGB } from '../build/png.mjs';

it('uses the standard PNG CRC and preserves compressed image pixels when tagging', () => {
  expect(crc32(Buffer.from('123456789'))).toBe(0xcbf43926);
  const png = readFileSync('public/apple-touch-icon.png');
  const chunks = image => {
    const result = [];
    for (let offset=8; offset<image.length;) {
      const length=image.readUInt32BE(offset);
      if (image.toString('ascii',offset+4,offset+8)==='IDAT') result.push(image.subarray(offset+8,offset+8+length));
      offset+=length+12;
    }
    return Buffer.concat(result);
  };
  expect(chunks(tagSRGB(png))).toEqual(chunks(png));
  expect(tagSRGB(png)).toEqual(png); // Repeat regeneration doesn't accumulate profiles.
});
it('rejects a non-PNG or an alpha/interlaced export rather than mislabelling it', () => {
  expect(() => tagSRGB(Buffer.from('not an icon'))).toThrow('Not a PNG');
  const alpha = Buffer.from(readFileSync('public/apple-touch-icon.png')); alpha[25]=6;
  expect(() => tagSRGB(alpha)).toThrow('opaque');
  const interlaced = Buffer.from(readFileSync('public/apple-touch-icon.png')); interlaced[28]=1;
  expect(() => tagSRGB(interlaced)).toThrow('non-interlaced');
});

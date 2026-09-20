import { describe, expect, it } from 'vitest';
import { optimizeImageUrl } from './imageUrl';

const cover = 'https://res.cloudinary.com/demo/image/upload/v1785448187/library/covers/abc123.png';

describe('optimizeImageUrl', () => {
  it('asks Cloudinary for a modern format, automatic quality and a width limit', () => {
    expect(optimizeImageUrl(cover, 400)).toBe(
      'https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,c_limit,w_400/v1785448187/library/covers/abc123.png'
    );
  });

  it('uses the requested width', () => {
    expect(optimizeImageUrl(cover, 200)).toContain('/f_auto,q_auto,c_limit,w_200/');
    expect(optimizeImageUrl(cover, 640)).toContain('/f_auto,q_auto,c_limit,w_640/');
  });

  it.each([
    ['another host', 'https://m.media-amazon.com/images/I/719fyFgdNJL._AC_UF1000,1000_QL80_.jpg'],
    ['a base64 data URI', 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD'],
    ['a blob preview', 'blob:http://localhost:5173/3f2a-1b'],
    ['a non-https Cloudinary URL', 'http://res.cloudinary.com/demo/image/upload/v1/x.png'],
    ['a Cloudinary video', 'https://res.cloudinary.com/demo/video/upload/v1/x.mp4'],
    ['an already transformed URL', 'https://res.cloudinary.com/demo/image/upload/c_fill,w_100/v1/x.png'],
    ['an empty string', ''],
  ])('leaves %s untouched', (_label, url) => {
    expect(optimizeImageUrl(url, 400)).toBe(url);
  });
});

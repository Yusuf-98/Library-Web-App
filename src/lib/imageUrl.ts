const CLOUDINARY_UPLOAD = /^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(v\d+\/.+)$/;

/**
 * Asks Cloudinary for a WebP/AVIF copy that is at most `width` px wide (pick about 2x the
 * displayed size). Other hosts, data URIs and already-transformed URLs are returned unchanged.
 */
export function optimizeImageUrl(url: string, width: number) {
  const match = CLOUDINARY_UPLOAD.exec(url);
  return match ? `${match[1]}f_auto,q_auto,c_limit,w_${width}/${match[2]}` : url;
}

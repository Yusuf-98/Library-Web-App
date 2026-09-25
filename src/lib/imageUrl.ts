// --- Patterns ---
const CLOUDINARY_UPLOAD = /^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(v\d+\/.+)$/;
const GRAMEDIA_ORIGINAL = /^(https:\/\/image\.gramedia\.net\/)rs:fit:0:0(\/plain\/.+)$/;
const AMAZON_FULL_SIZE = /^(https:\/\/m\.media-amazon\.com\/images\/I\/[^/]+\._AC_UF)\d+,\d+(_QL\d+_\.jpg)$/;

// --- Optimizer ---
export function optimizeImageUrl(url: string, width: number) {
  const cloudinary = CLOUDINARY_UPLOAD.exec(url);
  if (cloudinary) return `${cloudinary[1]}f_auto,q_auto,c_limit,w_${width}/${cloudinary[2]}`;

  const gramedia = GRAMEDIA_ORIGINAL.exec(url);
  if (gramedia) return `${gramedia[1]}rs:fit:${width}:0${gramedia[2]}`;

  const amazon = AMAZON_FULL_SIZE.exec(url);
  if (amazon) return `${amazon[1]}${width},${width}${amazon[2]}`;

  return url;
}

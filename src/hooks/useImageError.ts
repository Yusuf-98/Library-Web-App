import { useState } from 'react';

export function useImageError(src?: string | null) {
  const [errored, setErrored] = useState(false);
  const [prevSrc, setPrevSrc] = useState(src);

  if (src !== prevSrc) {
    setPrevSrc(src);
    setErrored(false);
  }

  const isUsable = !!src && !errored;

  const handleError = () => setErrored(true);

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.naturalWidth <= 1 || img.naturalHeight <= 1) setErrored(true);
  };

  return { isUsable, handleError, handleLoad };
}

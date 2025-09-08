import Image from "next/image";
import { useState } from "react";

interface FallbackImageProps {
  src: string;
  alt: string;
  fallbackSrc?: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
}

export default function FallbackImage({
  src,
  alt,
  fallbackSrc = "/api/placeholder/500/500",
  className,
  fill,
  width,
  height,
}: FallbackImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  };

  if (fill) {
    return (
      <Image
        src={imgSrc}
        alt={alt}
        fill
        className={className}
        onError={handleError}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    );
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={handleError}
    />
  );
}

import React from "react";

interface ImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: string | number;
  height?: string | number;
}

const Image: React.FC<ImageProps> = ({
  src,
  alt,
  className = "",
  width,
  height,
}) => {
  return (
    <img
      src={src}
      alt={alt}
      className={`object-cover ${className}`}
      width={width}
      height={height}
    />
  );
};

export default Image;

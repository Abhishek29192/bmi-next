import { useEffect, useState } from "react";

type Dimension = {
  width: number;
  height: number;
  media: TMediaNames;
};

export const MEDIA = {
  xs: 0,
  sm: 600,
  md: 720,
  lg: 840,
  xl: 1440
} as const;

export type TMediaNames = keyof typeof MEDIA;

const getMedia = (width: number): TMediaNames => {
  if (width < MEDIA.sm) {
    return "sm";
  }
  if (width < MEDIA.md) {
    return "md";
  }
  if (width < MEDIA.lg) {
    return "lg";
  }
  return "xl";
};

export const useWindowDimensions = (live = true) => {
  const [dimensions, setDimensions] = useState<Dimension>({
    width: window.innerWidth,
    height: window.innerHeight,
    media: getMedia(window.innerWidth)
  });

  const handleResize = () => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
      media: getMedia(window.innerWidth)
    });
  };

  useEffect(() => {
    live && window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize, live]);

  return dimensions;
};

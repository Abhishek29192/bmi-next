import { useEffect, useState } from "react";
import { GallerySectionMedias, transformMediaSrc } from "./media";

export const useTransformedMedias = (
  medias: readonly GallerySectionMedias[] = []
) => {
  const [transformedMedias, setTransformedMedias] = useState([]);

  useEffect(() => {
    const getMedias = async () => {
      const data = await transformMediaSrc(medias);
      setTransformedMedias(data);
    };
    getMedias();
  }, [medias]);

  return transformedMedias;
};

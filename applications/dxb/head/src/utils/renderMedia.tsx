import React from "react";

export const renderMedia = (mainImage: string, altText: string | undefined) => {
  return mainImage && <img src={mainImage} alt={altText} />;
};

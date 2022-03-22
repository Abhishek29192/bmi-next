import React from "react";

export const renderMedia = (mainImage: string, altText: string) => {
  return mainImage && <img src={mainImage} alt={altText} />;
};

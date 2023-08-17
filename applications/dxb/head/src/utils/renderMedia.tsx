import React from "react";

export const renderMedia = (mainImage?: string, altText?: string) => {
  if (!mainImage) {
    return undefined;
  }
  return <img src={mainImage} alt={altText} />;
};

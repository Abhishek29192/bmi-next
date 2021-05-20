import React from "react";
import styles from "./styles.module.scss";

export type BrandCarouselProps = {
  children?: React.ReactNode | React.ReactNode[];
};

export const BrandCarousel = ({ children }: BrandCarouselProps) => {
  return <div className={styles.main}>{children}</div>;
};

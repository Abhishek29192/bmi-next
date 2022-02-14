import React from "react";
import { MediaGallery, MediaData } from "@bmi/components";
import styles from "./styles/imageGallerySection.module.scss";

type Props = {
  media: readonly MediaData[];
};

const MediaGallerySection = ({ media }: Props) => (
  <MediaGallery className={styles["gallery"]} media={media} layout="short" />
);

export default MediaGallerySection;

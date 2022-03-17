import React from "react";
import { MediaGallery } from "@bmi/components";
import {
  mapGalleryImages,
  transformImages
} from "../../utils/product-details-transforms";
import { Image } from "../../components/types/pim";
import styles from "./styles/imageGallerySection.module.scss";

type Props = {
  images: readonly Image[];
};

const ImageGallerySection = ({ images }: Props) => (
  <MediaGallery
    className={styles["gallery"]}
    media={transformImages(mapGalleryImages(images))}
    layout="short"
  />
);

export default ImageGallerySection;

import React from "react";
import { ImageGallery } from "@bmi-digital/components";
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
  <ImageGallery
    className={styles["gallery"]}
    images={transformImages(mapGalleryImages(images))}
    layout="short"
  />
);

export default ImageGallerySection;

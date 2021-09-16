import React from "react";
import ImageGallery from "@bmi/image-gallery";
import { mapGalleryImages } from "../../utils/product-details-transforms";
import { Image } from "../../components/types/ProductBaseTypes";
import { GalleryImageType } from "./types";
import styles from "./styles/imageGallerySection.module.scss";

type Props = {
  images: Image[];
};

const transformImages = (images: Array<GalleryImageType>) => {
  return images.map(({ mainSource, thumbnail, altText }) => ({
    media: <img src={mainSource} alt={altText} />,
    thumbnail
  }));
};

const ImageGallerySection = ({ images }: Props) => (
  <ImageGallery
    className={styles["gallery"]}
    images={transformImages(mapGalleryImages(images))}
    layout="short"
  />
);

export default ImageGallerySection;

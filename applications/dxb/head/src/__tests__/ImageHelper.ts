import {
  Image,
  ImageAssetTypesEnum,
  ImageFormatEnum
} from "../components/types/pim";

const createImage = (image?: Partial<Image>): Image => ({
  allowedToDownload: false,
  altText: "image-alt-text",
  assetType: ImageAssetTypesEnum.MASTER_IMAGE,
  containerId: "image-container-id",
  fileSize: 10,
  format: ImageFormatEnum.PRODUCT_HERO_LARGE_DESKTOP,
  mime: "image/jpeg",
  name: "image-name",
  realFileName: "image-real-file-name.jpg",
  url: "http://localhost:8000/image-real-file-name.jpg",
  ...image
});

export default createImage;

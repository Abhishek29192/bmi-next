import { Image } from "../components/types/pim";

const createImage = (image?: Partial<Image>): Image => ({
  allowedToDownload: false,
  altText: "image-alt-text",
  assetType: "image-asset-type",
  containerId: "image-container-id",
  fileSize: 10,
  format: "Product-Hero-Large-Desktop",
  mime: "image/jpeg",
  name: "image-name",
  realFileName: "image-real-file-name.jpg",
  url: "http://localhost:8000/image-real-file-name.jpg",
  ...image
});

export default createImage;

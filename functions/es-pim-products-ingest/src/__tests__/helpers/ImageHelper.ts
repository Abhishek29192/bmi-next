import { Image } from "../../pim";

const createImage = (image?: Partial<Image>): Image => ({
  allowedToDownload: true,
  assetType: "MASTER_IMAGE",
  containerId: "container-id",
  fileSize: 10,
  format: "Product-Hero-Small-Desktop-Tablet",
  mime: "image/jpeg",
  name: "name",
  realFileName: "real-file-name.jpeg",
  url: "http://localhost:8000",
  ...image
});

export default createImage;

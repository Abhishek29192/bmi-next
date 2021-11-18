import { Image } from "../../pim";
import { ImageAssetTypesEnum } from "../../../../../head/src/components/types/pim";

const createImage = (image?: Partial<Image>): Image => ({
  allowedToDownload: true,
  assetType: ImageAssetTypesEnum.MASTER_IMAGE,
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

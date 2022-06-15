import { Image } from "./types";

const createImage = (image?: Partial<Image>): Image => ({
  altText: "name",
  mainSource: "http://localhost:8000",
  thumbnail: "http://localhost:8000",
  ...image
});

export default createImage;

import { Image } from "../../types/pim";

const createImage = (image?: Partial<Image>): Image => ({
  mainSource: "http://localhost:8000/image-main-source.jpg",
  thumbnail: "http://localhost:8000/image-thumbnail.jpg",
  altText: "Alt text",
  ...image
});

export default createImage;

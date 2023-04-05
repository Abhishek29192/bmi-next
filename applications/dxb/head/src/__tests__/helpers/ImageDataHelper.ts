import { Data as ImageData } from "../../components/Image";
import createGatsbyImageData from "./GatsbyImageDataHelper";

const createImageData = (imageData?: Partial<ImageData>): ImageData => ({
  type: "Decorative",
  altText: "BMI Decra rense takrennen BMI Norge",
  focalPoint: null,
  image: {
    file: {
      fileName: "BMI_Decra_rense_takrennen_BMI_Norge.jpg",
      url: "//images.ctfassets.net/un5bh1z034o8/2uiUayMfc3Cr7DzNFhZIKi/e9eaf6f69a2448d267cacb95022f12f6/BMI_Decra_rense_takrennen_BMI_Norge.jpg"
    },
    gatsbyImageData: createGatsbyImageData()
  },
  ...imageData
});

export default createImageData;

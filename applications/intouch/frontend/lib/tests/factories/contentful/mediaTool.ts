import deepMerge from "lodash/merge";
import { Asset, MediaTool } from "@bmi/intouch-api-types";

type MockMediaToolConfig = {
  type?: "pdf" | "image" | "video" | "external" | "vimeo";
  media?: Partial<Asset>;
  thumbnail?: Partial<Asset>;
};

export const generateMediaTool = ({
  type = "image",
  media = {}
}: MockMediaToolConfig): MediaTool => {
  const defaultMock = {
    pdf: mockMediaToolPDF,
    image: mockMediaToolImage,
    vimeo: mockMediaToolVimeo,
    external: mockMediaToolExternal
  }[`${type}`];

  return deepMerge(defaultMock, { media });
};

export const mockMediaToolImage = {
  __typename: "MediaTool",
  sys: { id: "4Lj01mNLlQH5LnXEbcRunh" },
  name: "Project Focus Image",
  media: {
    sys: { id: "3xRNhMJ9O2R48m7YfbZ56f" },
    title: "Aspirational architecture photo",
    description: "Nice pool, terrace, lifestyle",
    contentType: "image/jpeg",
    fileName: "oodi1_1756x900_0 (1).jpg",
    size: 1306722,
    url: "https://images.ctfassets.net/opay6t6wwmup/3xRNhMJ9O2R48m7YfbZ56f/ac9e9d24a0329c74f67d11ce879fe648/oodi1_1756x900_0__1_.jpg",
    width: 1756,
    height: 900
  },
  thumbnail: {
    sys: { id: "3xRNhMJ9O2R48m7YfbZ56f" },
    title: "Aspirational architecture photo",
    description: "Nice pool, terrace, lifestyle",
    contentType: "image/jpeg",
    fileName: "oodi1_1756x900_0 (1).jpg",
    size: 1306722,
    url: "https://images.ctfassets.net/opay6t6wwmup/3xRNhMJ9O2R48m7YfbZ56f/ac9e9d24a0329c74f67d11ce879fe648/oodi1_1756x900_0__1_.jpg",
    width: 1756,
    height: 900
  },
  url: null
};

export const mockMediaToolPDF = {
  __typename: "MediaTool",
  sys: { id: "2H9GYsnHaV75zBRmqxvxKW" },
  name: "Nordica",
  media: {
    sys: { id: "1a11UUWud7CdKtmHwF1NUw" },
    title: "Nordica specification",
    description: "A pdf of the Nordica tiles specification",
    contentType: "application/pdf",
    fileName: "nordica.pdf",
    size: 231255,
    url: "https://assets.ctfassets.net/opay6t6wwmup/1a11UUWud7CdKtmHwF1NUw/05a95cb6ca5fc78dc3067670e9b2c257/nordica.pdf",
    width: null,
    height: null
  },
  thumbnail: null,
  url: null
};

export const mockMediaToolVimeo = {
  __typename: "MediaTool",
  sys: { id: "4WuF7lqmeYsfG1xfY136B3" },
  name: "About BMI",
  media: null,
  thumbnail: {
    sys: { id: "1Kt0vRbixNOiooywauG4I2" },
    title: "Beach life",
    description: "Big houses on a beach with nice rooves",
    contentType: "image/png",
    fileName: "Screenshot 2021-03-10 at 23.46.05.png",
    size: 2150141,
    url: "https://images.ctfassets.net/opay6t6wwmup/1Kt0vRbixNOiooywauG4I2/bf5ce35bf0920da8f92f6454a66750f6/Screenshot_2021-03-10_at_23.46.05.png",
    width: 1516,
    height: 884
  },
  url: "https://vimeo.com/424813433"
};

export const mockMediaToolExternal = {
  __typename: "MediaTool",
  sys: { id: "6iNtFnMG0wrIUEDoNT5t0B" },
  name: "Innovation",
  media: null,
  thumbnail: {
    sys: { id: "2xUf1gGekGtJGIlULjBZTE" },
    title: "Solar heaters",
    description: "Pic of some solar power water heaters on a roof",
    contentType: "image/jpeg",
    fileName: "solar heaters.jpg",
    size: 4071598,
    url: "https://images.ctfassets.net/opay6t6wwmup/2xUf1gGekGtJGIlULjBZTE/8920527ae5ad07619ae5365976837093/solar_heaters.jpg",
    width: 2480,
    height: 2480
  },
  url: "https://www.bmigroup.com/innovation"
};

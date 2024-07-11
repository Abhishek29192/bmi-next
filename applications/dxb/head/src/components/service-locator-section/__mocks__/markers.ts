import { EntryTypeEnum } from "../../Service";
import type { Service } from "../index";
import type { Data as ContentfulImageData } from "../../image/contentful-image/types";

export const markersMockData = [
  {
    title: "Nortekk",
    position: {
      lat: 60.00797,
      lng: 11.04312
    },
    isActive: null,
    data: {
      __typename: "Roofer",
      id: "27f97982-479f-5319-8006-111dbdaf84b0",
      entryType: "Roofer",
      name: "Nortekk",
      location: {
        lat: 60.00797,
        lon: 11.04312
      },
      address: "Industriveien 9C, 2020 Skedsmokorset, Norway",
      phone: "92690126",
      email: "lmn@nortekk.no",
      website: "https://www.nortekk.no",
      fax: null,
      type: ["Pitched roof"],
      branchType: null,
      merchantType: null,
      certification: null,
      summary: null
    }
  }
];

export const selectedRooferMock: Service = {
  __typename: "Roofer",
  id: "27f97982-479f-5319-8006-111dbdaf84b0",
  entryType: EntryTypeEnum.ROOFER_TYPE,
  name: "Nortekk",
  location: {
    lat: 60.00797,
    lon: 11.04312
  },
  address: "Industriveien 9C, 2020 Skedsmokorset, Norway",
  phone: "92690126",
  email: "lmn@nortekk.no",
  website: "https://www.nortekk.no",
  facebook: null,
  instagram: null,
  linkedIn: null,
  twitter: null,
  fax: null,
  companyLogo: undefined,
  serviceTypes: [{ __typename: "ServiceType", name: "Pitched roof" }],
  certification: null,
  summary: "test summary",
  websiteLinkAsLabel: false
};

export const imageData: ContentfulImageData = {
  __typename: "Image",
  title: "Title",
  type: null,
  altText: "Logo von BMI Icopal",
  focalPoint: null,
  image: {
    fileName: "logo_icopal_2560x1710px_rahmen.jpeg",
    contentType: "image/jpg",
    url: "https://images.ctfassets.net/xd0cdgm332jz/3RRWFgk7OviMBNU2mwgvlx/e00e18fedaf95f571d20575da89ade93/logo_icopal_2560x1710px_rahmen.jpeg?w=1000&h=668&fl=progressive&q=50&fm=jpg",
    width: 100,
    height: 100,
    size: 100
  }
};

import { Data as ContentfulImageData } from "../../Image";
import { EntryTypeEnum } from "../../Service";
import { Service } from "../index";

export const markersMockData = [
  {
    title: "Nortekk",
    position: {
      lat: 60.00797,
      lng: 11.04312
    },
    isActive: null,
    data: {
      __typename: "ContentfulService",
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
  __typename: "ContentfulService",
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
  fax: null,
  companyLogo: null,
  serviceTypes: [{ __typename: "ContentfulServiceType", name: "Pitched roof" }],
  certification: null,
  summary: "test summary",
  websiteLinkAsLabel: false
};

export const imageData: ContentfulImageData = {
  type: null,
  altText: "Logo von BMI Icopal",
  focalPoint: null,
  image: {
    file: {
      fileName: "logo_icopal_2560x1710px_rahmen.jpeg",
      url: "//images.ctfassets.net/xd0cdgm332jz/3RRWFgk7OviMBNU2mwgvlx/e00e18fedaf95f571d20575da89ade93/logo_icopal_2560x1710px_rahmen.jpeg"
    },
    gatsbyImageData: {
      images: {
        sources: [
          {
            srcSet:
              "https://images.ctfassets.net/xd0cdgm332jz/3RRWFgk7OviMBNU2mwgvlx/e00e18fedaf95f571d20575da89ade93/logo_icopal_2560x1710px_rahmen.jpeg?w=250&h=167&q=50&fm=webp 250w,\nhttps://images.ctfassets.net/xd0cdgm332jz/3RRWFgk7OviMBNU2mwgvlx/e00e18fedaf95f571d20575da89ade93/logo_icopal_2560x1710px_rahmen.jpeg?w=500&h=334&q=50&fm=webp 500w,\nhttps://images.ctfassets.net/xd0cdgm332jz/3RRWFgk7OviMBNU2mwgvlx/e00e18fedaf95f571d20575da89ade93/logo_icopal_2560x1710px_rahmen.jpeg?w=1000&h=668&q=50&fm=webp 1000w,\nhttps://images.ctfassets.net/xd0cdgm332jz/3RRWFgk7OviMBNU2mwgvlx/e00e18fedaf95f571d20575da89ade93/logo_icopal_2560x1710px_rahmen.jpeg?w=2000&h=1336&q=50&fm=webp 2000w",
            sizes: "(min-width: 1000px) 1000px, 100vw",
            type: "image/webp"
          }
        ],
        fallback: {
          src: "https://images.ctfassets.net/xd0cdgm332jz/3RRWFgk7OviMBNU2mwgvlx/e00e18fedaf95f571d20575da89ade93/logo_icopal_2560x1710px_rahmen.jpeg?w=1000&h=668&fl=progressive&q=50&fm=jpg",
          srcSet:
            "https://images.ctfassets.net/xd0cdgm332jz/3RRWFgk7OviMBNU2mwgvlx/e00e18fedaf95f571d20575da89ade93/logo_icopal_2560x1710px_rahmen.jpeg?w=250&h=167&fl=progressive&q=50&fm=jpg 250w,\nhttps://images.ctfassets.net/xd0cdgm332jz/3RRWFgk7OviMBNU2mwgvlx/e00e18fedaf95f571d20575da89ade93/logo_icopal_2560x1710px_rahmen.jpeg?w=500&h=334&fl=progressive&q=50&fm=jpg 500w,\nhttps://images.ctfassets.net/xd0cdgm332jz/3RRWFgk7OviMBNU2mwgvlx/e00e18fedaf95f571d20575da89ade93/logo_icopal_2560x1710px_rahmen.jpeg?w=1000&h=668&fl=progressive&q=50&fm=jpg 1000w,\nhttps://images.ctfassets.net/xd0cdgm332jz/3RRWFgk7OviMBNU2mwgvlx/e00e18fedaf95f571d20575da89ade93/logo_icopal_2560x1710px_rahmen.jpeg?w=2000&h=1336&fl=progressive&q=50&fm=jpg 2000w",
          sizes: "(min-width: 1000px) 1000px, 100vw"
        }
      },
      layout: "constrained",
      backgroundColor: "#f8f8f8",
      width: 1000,
      height: 668
    }
  }
};

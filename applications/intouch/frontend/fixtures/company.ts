import { GetCompanyQuery } from "../graphql/generated/operations";

export const mockCompany: GetCompanyQuery["company"] = {
  id: 1,
  logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Smiley.svg/1280px-Smiley.svg.png",
  name: "Integrated Solutions Inc",
  phone: "843-985-4588",
  website: "https://sphinn.com",
  aboutUs: "We put stuff together really quickly without any fuss",
  publicEmail: "lfoskin0@paypal.com",
  companyMembers: {
    nodes: []
  },
  registeredAddress: {
    firstLine: "Registered Nursery Rd",
    secondLine: "Brixton",
    town: "London",
    region: null,
    country: "UK",
    postcode: "SW9 8BP"
  },
  tradingAddress: {
    firstLine: "Trading Nursery Rd",
    secondLine: "Brixton",
    town: "London",
    region: null,
    country: "UK",
    postcode: "SW9 8BP",
    coordinates: { x: 51.4632583, y: -0.1194107 }
  },
  certifications: ["FLAT", "PITCHED"]
};

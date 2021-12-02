import { GetCompanyQuery } from "../graphql/generated/operations";

export const mockCompany: GetCompanyQuery["company"] = {
  __typename: "Company",
  id: 1,
  status: "ACTIVE",
  businessType: "CONTRACTOR",
  logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Smiley.svg/1280px-Smiley.svg.png",
  aboutUs: "We put stuff together really quickly without any fuss",
  tradingAddress: {
    __typename: "Address",
    id: 4,
    coordinates: { __typename: "Point", x: 51.4632583, y: -0.1194107 },
    firstLine: "Nursery Rd",
    secondLine: "Brixton",
    town: "London",
    region: null,
    country: "UK",
    postcode: "SW9 8BP"
  },
  ownerFullname: "Don Cheadle",
  ownerPhone: "1232123",
  ownerEmail: "don@test.com",
  phone: "8439854588",
  publicEmail: "lfoskin0@paypal.com",
  website: "https://sphinn.com",
  facebook: "https://www.facebook.com/WhiteHouse/",
  linkedIn: "https://www.linkedin.com/company/the-white-house",
  name: "Integrated Solutions Inc",
  referenceNumber: 937392,
  registeredAddress: {
    __typename: "Address",
    id: 1,
    firstLine: "Blue Star House",
    secondLine: "234-244 Stockwell Road",
    town: "Brixton",
    region: "London",
    country: "UK",
    postcode: "SW9 9SP"
  },
  taxNumber: "63323-463",
  tier: "T2",
  companyOperationsByCompany: {
    __typename: "CompanyOperationsConnection",
    nodes: [
      {
        __typename: "CompanyOperation",
        id: 1,
        operation: "PITCHED"
      },
      {
        __typename: "CompanyOperation",
        id: 2,
        operation: "FLAT"
      }
    ]
  },
  companyMembers: {
    __typename: "CompanyMembersConnection",
    nodes: [
      {
        __typename: "CompanyMember",
        account: {
          __typename: "Account",
          role: "COMPANY_ADMIN",
          id: 3,
          firstName: "Dom",
          lastName: "Perignon",
          phone: "1234567",
          email: "devs+3@digitaldetox.co.uk",
          photo:
            "https://vinepair.com/wp-content/uploads/2017/01/domperignon-internal.jpg"
        }
      },
      {
        __typename: "CompanyMember",
        account: {
          __typename: "Account",
          role: "COMPANY_ADMIN",
          id: 4,
          firstName: "Ben",
          lastName: "Afleck",
          phone: "1234567",
          email: "devs+4@digitaldetox.co.uk",
          photo:
            "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Ben_Affleck_by_Gage_Skidmore_3.jpg/440px-Ben_Affleck_by_Gage_Skidmore_3.jpg"
        }
      },
      {
        __typename: "CompanyMember",
        account: {
          __typename: "Account",
          role: "COMPANY_ADMIN",
          id: 5,
          firstName: "Steve",
          lastName: "Jobs",
          phone: "1234567",
          email: "devs+5@digitaldetox.co.uk",
          photo:
            "https://i0.wp.com/9to5mac.com/wp-content/uploads/sites/6/2021/02/Tim-Cook-remembers-Steve-Jobs.jpg"
        }
      },
      {
        __typename: "CompanyMember",
        account: {
          __typename: "Account",
          role: "INSTALLER",
          id: 6,
          firstName: "Umit",
          lastName: "Davala",
          phone: "1234567",
          email: "devs+6@digitaldetox.co.uk",
          photo: "https://www.bdfutbol.com/i/j/92223b.jpg"
        }
      }
    ]
  },
  companyDocuments: {
    nodes: []
  },
  certifications: ["FLAT", "PITCHED"],
  isProfileComplete: true
};

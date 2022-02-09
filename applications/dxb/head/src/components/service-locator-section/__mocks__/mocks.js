"use strict";

const markersMockData = [
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

const selectedRooferMock = {
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
  summary: "test summary"
};

module.exports = {
  markersMockData,
  selectedRooferMock
};

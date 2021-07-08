import { Roofer } from "../components/ServiceLocatorSection";

const createRoofer = (roofer?: Partial<Roofer>): Roofer => ({
  __typename: "ContentfulRoofer",
  id: "roofer_id",
  name: "roofer 1",
  location: {
    lat: 0,
    lon: 0
  },
  address: "address 1",
  phone: "phone 1",
  email: "test@test.com",
  website: "www.test.com",
  type: null,
  certification: null,
  summary: "roofer summary",
  distance: 10,
  ...roofer
});

export default createRoofer;

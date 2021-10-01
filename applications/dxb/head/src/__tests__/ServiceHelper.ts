import { EntryTypeEnum } from "../components/Service";
import { Service } from "../components/ServiceLocatorSection";

const createRoofer = (service?: Partial<Service>): Service => ({
  __typename: "ContentfulService",
  entryType: EntryTypeEnum.ROOFER_TYPE,
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
  fax: "fax 1",
  type: null,
  branchType: null,
  merchantType: null,
  certification: null,
  summary: "roofer summary",
  distance: 10,
  ...service
});

export default createRoofer;

import { EntryTypeEnum } from "../../components/Service";
import { Service } from "../../components/service-locator-section";

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
  facebook: null,
  linkedIn: null,
  instagram: null,
  twitter: null,
  fax: "fax 1",
  companyLogo: null,
  serviceTypes: null,
  certification: null,
  summary: "roofer summary",
  distance: 10,
  websiteLinkAsLabel: false,
  ...service
});

export default createRoofer;

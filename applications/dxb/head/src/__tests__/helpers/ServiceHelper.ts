import { EntryTypeEnum } from "../../components/Service";
import { Service } from "../../components/service-locator-section";
import createImageData from "./ImageDataHelper";

export const createFullyPopulatedService = (
  service?: Partial<Service>
): Service => ({
  ...createService(),
  phone: "01234567890",
  email: "test@test.com",
  website: "http://localhost",
  facebook: "facebook",
  linkedIn: "linkedin",
  instagram: "instagram",
  twitter: "twitter",
  fax: "01234567891",
  serviceTypes: [{ __typename: "ContentfulServiceType", name: "Pitched Roof" }],
  certification: "elite",
  summary: "Contentful service summary",
  websiteLinkAsLabel: false,
  companyLogo: createImageData(),
  distance: 10,
  ...service
});

const createService = (service?: Partial<Service>): Service => ({
  __typename: "ContentfulService",
  entryType: EntryTypeEnum.ROOFER_TYPE,
  id: "roofer_id",
  name: "roofer 1",
  location: {
    lat: 0,
    lon: 0
  },
  address: "address 1",
  phone: null,
  email: null,
  website: null,
  facebook: null,
  linkedIn: null,
  instagram: null,
  twitter: null,
  fax: null,
  serviceTypes: null,
  certification: null,
  summary: null,
  websiteLinkAsLabel: null,
  ...service
});

export default createService;

import { EntryTypeEnum } from "../../../../components/Service";
import createContentfulRichText from "./ContentfulRichText";
import type {
  ContentfulServiceLocatorData,
  ContentfulServiceData
} from "../ServiceLocatorSection";

const createContentfulServiceLocatorSection = (
  serviceLocatorSectionData?: Partial<ContentfulServiceLocatorData>
): ContentfulServiceLocatorData => ({
  __typename: "ServiceLocatorSection",
  body: createContentfulRichText(),
  type: EntryTypeEnum.ROOFER_TYPE,
  showDefaultResultList: true,
  title: "Title",
  label: "Label",
  position: 100,
  centre: {
    lat: 11,
    lon: 11
  },
  zoom: 8,
  ...serviceLocatorSectionData
});

export const createContentfulService = (
  service?: Partial<ContentfulServiceData>
): ContentfulServiceData => ({
  __typename: "Roofer",
  entryType: EntryTypeEnum.ROOFER_TYPE,
  name: "roofer 1",
  location: {
    lat: 0,
    lon: 0
  },
  companyLogo: null,
  address: "address 1",
  phone: null,
  email: null,
  website: null,
  facebook: null,
  linkedIn: null,
  instagram: null,
  twitter: null,
  fax: null,
  serviceTypesCollection: { items: [] },
  certification: null,
  summary: undefined,
  websiteLinkAsLabel: null,
  sys: {
    id: "service-id"
  },
  ...service
});

export default createContentfulServiceLocatorSection;

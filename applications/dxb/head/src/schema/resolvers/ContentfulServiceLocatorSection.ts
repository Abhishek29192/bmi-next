import getContentfulData from "../../utils/getContentfulData";
import {
  AssetFragment,
  EntryIdFragment,
  ImageFragment
} from "../fragments/contentfulFragments";
import getTagFilter from "../../utils/getTagFilter";
import resolveRichText from "./ContentfulRichText";
import type { Data as ServiceLocatorData } from "../../components/service-locator-section";
import type {
  ContentfulServiceLocatorData,
  ContentfulServiceData
} from "./types/ServiceLocatorSection";

const servicesQuery = `
query ($locale: String!, $limit: Int!, $skip: Int!, $rooferFilter: RooferFilter!) {
  rooferCollection(locale: $locale, limit: $limit, skip: $skip, where: $rooferFilter) {
    total
    items {
      __typename
      ...ContentfulEntryId
      entryType
      name
      location {
        lat
        lon
      }
      address
      phone
      email
      website
      facebook
      twitter
      instagram
      linkedIn
      websiteLinkAsLabel
      companyLogo {
        ...ImageFragment
      }
      fax
      #Limit:50 is needed to not hit the maximum query complexity limit
      serviceTypesCollection(limit: 50) {
        items {
          __typename
          name
        }
      }
      certification
      summary
    }
  }
}
${AssetFragment}
${ImageFragment}
${EntryIdFragment}
`;

const resolveServiceLocatorSection = async ({
  body,
  ...rest
}: ContentfulServiceLocatorData): Promise<ServiceLocatorData> => {
  const services = await getServices(rest.type);

  return {
    ...rest,
    body: body ? await resolveRichText(body) : null,
    services: transformServices(services)
  };
};

const ITEMS_PER_REQUEST = 100;
const getServices = async (
  type: string,
  skip: number = 0
): Promise<ContentfulServiceData[]> => {
  try {
    const data = await getContentfulData<{
      rooferCollection: { total: number; items: ContentfulServiceData[] };
    }>(servicesQuery, {
      rooferFilter: { entryType: type, ...getTagFilter() },
      locale: process.env.NEXT_PUBLIC_MARKET_LOCALE_CODE!,
      limit: ITEMS_PER_REQUEST,
      skip
    });

    if (data.errors) {
      console.error(data.errors);
      return [];
    }

    const hasMore = data.data.rooferCollection.total > skip + ITEMS_PER_REQUEST;

    const moreRoofers = hasMore
      ? await getServices(type, skip + ITEMS_PER_REQUEST)
      : [];

    return [...data.data.rooferCollection.items, ...moreRoofers];
  } catch (err: any) {
    console.error(
      `Did not manage to get services with the following error - ${err.message}`
    );
    return [];
  }
};

const transformServices = (
  services: ContentfulServiceData[]
): ServiceLocatorData["services"] =>
  services.map(({ serviceTypesCollection, sys, ...rest }) => ({
    ...rest,
    serviceTypes: serviceTypesCollection.items,
    id: sys.id
  }));

export default resolveServiceLocatorSection;

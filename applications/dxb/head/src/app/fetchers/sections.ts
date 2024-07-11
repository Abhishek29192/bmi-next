import { isDefined } from "@bmi/utils";
import getContentfulData from "../../utils/getContentfulData";
import sectionsQuery from "../../schema/queries/sections";
import type {
  ContentfulSections,
  ContentfulSection
} from "../../schema/resolvers/types/Sections";

const getSections = async (ids: string[]): Promise<ContentfulSections> => {
  const promises = ids.map(async (sectionId) => {
    const data = await getContentfulData<{
      entryCollection: { items: [ContentfulSection] };
    }>(sectionsQuery, { id: sectionId });

    if (data.errors) {
      throw new Error(
        `Contentful GraphQL request for a section with ID:${sectionId} failed - ${data.errors}`
      );
    }

    return data;
  });

  const resolvedPromises = await Promise.all(promises);

  return resolvedPromises
    .map((promise) => promise.data.entryCollection.items[0])
    .filter(isDefined);
};

export default getSections;

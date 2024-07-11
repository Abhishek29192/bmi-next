import getContentfulData from "../../utils/getContentfulData";
import { Data as MicroCopyData } from "../../components/MicroCopy";
import getTagFilter from "../../utils/getTagFilter";

//1000 is the maximum allowed limit
const ITEMS_PER_REQUEST = 1000;

const microCopiesQuery = `
query ($tagFilter: ResourceFilter!, $skip: Int!) {
  resourceCollection(skip: $skip, limit: ${ITEMS_PER_REQUEST}, where: $tagFilter) {
    total
    items {
      key
      value
    }
  }
}`;

const getMicroCopies = async (skip: number = 0): Promise<MicroCopyData[]> => {
  try {
    const data = await getContentfulData<{
      resourceCollection: { total: number; items: MicroCopyData[] };
    }>(microCopiesQuery, {
      limit: ITEMS_PER_REQUEST,
      skip,
      tagFilter: getTagFilter()
    });

    if (data.errors) {
      console.error(data.errors);
      return [];
    }

    const hasMore =
      data.data.resourceCollection.total > ITEMS_PER_REQUEST + skip;

    const moreMicroCopies = hasMore
      ? await getMicroCopies(skip + ITEMS_PER_REQUEST)
      : [];

    return [...data.data.resourceCollection.items, ...moreMicroCopies];
  } catch (err: any) {
    console.error(
      `Did not manage to get microCopies with the following error - ${err.message}`
    );
    return [];
  }
};

export default getMicroCopies;

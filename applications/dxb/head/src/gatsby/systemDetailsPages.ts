import path from "path";
import { getPathWithCountryCode } from "../schema/resolvers/utils/path";

import { CreatePagesOptions } from "./types";

interface PageContext {
  systemPageId: string;
  siteId: string;
}

interface QueryData {
  systems: {
    id: string;
  };
}

export const createSystemPages = async ({
  siteId,
  countryCode,
  createPage,
  graphql
}: CreatePagesOptions) => {
  const component = path.resolve(
    "./src/templates/systemDetails/systemDetailsPage.tsx"
  );

  const result = await graphql<QueryData>(`
    {
      systems {
        id
      }
    }
  `);

  if (result.errors) {
    throw new Error(result.errors);
  }

  const {
    data: {
      systems: { id }
    }
  } = result;

  await createPage<PageContext>({
    path: getPathWithCountryCode(countryCode, "system-details-page/"),
    component,
    context: {
      systemPageId: id,
      siteId
    }
  });
};

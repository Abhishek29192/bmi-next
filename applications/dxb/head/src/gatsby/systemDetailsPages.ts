import path from "path";

import { CreatePagesOptions } from "./types";

interface PageContext {
  systemPageId: string;
  siteId: string;
}

interface QueryData {
  dataJson: {
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
      dataJson {
        id
      }
    }
  `);

  if (result.errors) {
    throw new Error(result.errors);
  }

  const {
    data: {
      dataJson: { id }
    }
  } = result;

  await createPage<PageContext>({
    path: `/${countryCode}/system-details-page/`,
    component,
    context: {
      systemPageId: id,
      siteId
    }
  });
};

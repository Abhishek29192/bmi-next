import path from "path";
import type { Actions, CreatePagesArgs } from "gatsby";
import { getPathWithCountryCode } from "../utils/path";

interface PageContext {
  systemCode: string;
  siteId: string;
}

interface QueryData {
  allSystem: {
    nodes: {
      code: string;
      path: string;
    }[];
  };
}

type CreatePagesOptions = {
  siteId: string;
  countryCode: string;
  createPage: Actions["createPage"];
  graphql: CreatePagesArgs["graphql"];
};

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
      allSystem {
        nodes {
          code
          path
        }
      }
    }
  `);

  if (result.errors) {
    throw new Error(result.errors);
  }

  const {
    data: {
      allSystem: { nodes: allPimSystems }
    }
  } = result;

  await Promise.all(
    allPimSystems.map(async ({ code, path }) => {
      await createPage<PageContext>({
        path: getPathWithCountryCode(countryCode, path),
        component,
        context: {
          systemCode: code,
          siteId
        }
      });
    })
  );
};

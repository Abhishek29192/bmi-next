import path from "path";
import { getPathWithCountryCode } from "../schema/resolvers/utils/path";
import { CreatePagesOptions } from "./types";

interface PageContext {
  systemPageId: string;
  siteId: string;
  relatedSystemCodes: string[];
}

interface SystemReference {
  referenceType: string;
  target: {
    code: string;
  };
}

interface QueryData {
  allSystems: {
    nodes: {
      id: string;
      path: string;
      systemReferences: SystemReference[];
    }[];
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
      allSystems {
        nodes {
          id
          path
          systemReferences {
            referenceType
            target {
              code
            }
          }
        }
      }
    }
  `);

  if (result.errors) {
    throw new Error(result.errors);
  }

  const {
    data: {
      allSystems: { nodes: allPimSystems }
    }
  } = result;

  await Promise.all(
    allPimSystems.map(async ({ id: systemPageId, path, systemReferences }) => {
      const relatedSystemCodes = systemReferences
        ?.filter((systemRefObj) => systemRefObj.referenceType === "CROSSELLING")
        .map(({ target: { code } }) => code);

      await createPage<PageContext>({
        path: getPathWithCountryCode(countryCode, path),
        component,
        context: {
          systemPageId,
          siteId,
          relatedSystemCodes
        }
      });
    })
  );
};

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
      path: string;
      approvalStatus: string;
    }[];
  };
  systems: {
    id: string;
    systemReferences: SystemReference[];
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
      allSystems: allSystems {
        nodes {
          path
          approvalStatus
        }
      }
      systems {
        id
        systemReferences {
          referenceType
          target {
            code
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
      allSystems: { nodes: allPimSystems },
      systems: { id, systemReferences }
    }
  } = result;

  let relatedSystemCodes: string[] = [];

  // TODO: Probably a way of abstracting this into a function

  relatedSystemCodes = systemReferences
    ?.filter((systemRefObj) => systemRefObj.referenceType === "CROSSELLING")
    .map(({ target: { code } }) => code);

  await Promise.all(
    allPimSystems.map(async ({ path, approvalStatus }) => {
      if (approvalStatus === "approved") {
        await createPage<PageContext>({
          path: getPathWithCountryCode(countryCode, path),
          component,
          context: {
            systemPageId: id,
            siteId,
            relatedSystemCodes
          }
        });
      }
    })
  );
};

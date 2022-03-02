import path from "path";
import { getPathWithCountryCode } from "../utils/path";
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
      approvalStatus: string;
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
          approvalStatus
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
    allPimSystems.map(
      async ({ id: systemPageId, path, approvalStatus, systemReferences }) => {
        if (approvalStatus === "approved") {
          const relatedSystemCodes = (systemReferences || [])
            .filter(
              (systemRefObj) => systemRefObj.referenceType === "CROSSELLING"
            )
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
        } else {
          // eslint-disable-next-line no-console
          console.warn(
            `cannot create system page for ${systemPageId} - ${path} as its approvalStatus is ${approvalStatus}`
          );
        }
      }
    )
  );
};
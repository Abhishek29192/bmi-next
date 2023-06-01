import { getItemsValidations } from "@bmi-digital/contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description =
  "Add Brand Landing Page to pages validation for page content type";

export const up: MigrationFunction = async (migration, context) => {
  const site = migration.editContentType("site");

  const { validation } = await getItemsValidations(
    context!.makeRequest,
    site.id,
    "pages"
  );

  site.editField("pages").items({
    type: "Link",
    validations: [
      {
        linkContentType: [
          ...(validation?.linkContentType || []),
          "brandLandingPage"
        ]
      }
    ],
    linkType: "Entry"
  });
};

export const down: MigrationFunction = async (migration, context) => {
  const site = migration.editContentType("site");

  const { validation } = await getItemsValidations(
    context!.makeRequest,
    site.id,
    "pages"
  );

  site.editField("pages").items({
    type: "Link",
    validations: [
      {
        linkContentType: validation?.linkContentType?.filter(
          (entryType) => entryType !== "brandLandingPage"
        )
      }
    ],
    linkType: "Entry"
  });
};

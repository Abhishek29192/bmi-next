import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Create content type for Document Library Page";

export const up: MigrationFunction = (migration: Migration) => {
  const documentLibraryPage = migration
    .createContentType("documentLibraryPage")
    .name("Document Library Page")
    .displayField("title")
    .description(
      "This page displays documents available for download from PIM and the CMS"
    );

  documentLibraryPage
    .createField("title")
    .name("Title")
    .type("Symbol")
    .required(true);

  documentLibraryPage
    .createField("slug")
    .name("Slug")
    .type("Symbol")
    .validations([{ unique: true }])
    .required(true);

  documentLibraryPage.createField("subtitle").name("Subtitle").type("Symbol");

  documentLibraryPage
    .createField("description")
    .name("Description")
    .type("RichText");

  documentLibraryPage
    .createField("source")
    .name("Source")
    .type("Symbol")
    .validations([{ in: ["PIM", "CMS", "ALL"] }])
    .required(true);

  documentLibraryPage
    .createField("assetTypes")
    .name("Asset Types")
    .type("Array")
    .items({
      type: "Link",
      validations: [{ linkContentType: ["assetType"] }],
      linkType: "Entry"
    })
    .required(true);

  documentLibraryPage
    .createField("resultsType")
    .name("Results Type")
    .type("Symbol")
    .required(true)
    .validations([{ in: ["Simple", "Technical", "Card Collection"] }]);

  documentLibraryPage
    .createField("inputBanner")
    .name("Input Banner")
    .type("Link")
    .required(true)
    .validations([{ linkContentType: ["inputBanner"] }])
    .linkType("Entry");

  documentLibraryPage
    .createField("tag")
    .name("Tag")
    .type("Link")
    .validations([{ linkContentType: ["tag"] }])
    .linkType("Entry");
};

export const down: MigrationFunction = (migration: Migration) =>
  migration.deleteContentType("documentLibraryPage");

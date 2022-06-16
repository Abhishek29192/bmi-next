import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

const pageContentTypes = [
  "page",
  "homePage",
  "contactUsPage",
  "productListerPage",
  "documentLibraryPage",
  "resources",
  "brandLandingPage"
];

export const description =
  "Link signup block entity for the following pages: " +
  pageContentTypes.join(", ");

export const up: MigrationFunction = (migration: Migration) => {
  pageContentTypes.forEach((contentType) => {
    const currentContentType = migration.editContentType(contentType);
    if (contentType === "resources") {
      currentContentType.deleteField("pdpInputBanner");
    } else {
      currentContentType.deleteField("inputBanner");
    }
  });
};

export const down: MigrationFunction = (migration: Migration) => {
  pageContentTypes.forEach((contentType) => {
    const currentContentType = migration.editContentType(contentType);
    if (contentType === "resources") {
      currentContentType
        .createField("pdpInputBanner")
        .name("PDP: input banner")
        .type("Link")
        .validations([{ linkContentType: ["inputBanner"] }])
        .linkType("Entry");
      currentContentType.changeFieldControl(
        "pdpInputBanner",
        "builtin",
        "entryLinkEditor"
      );
    } else {
      currentContentType
        .createField("inputBanner")
        .name("Input Banner")
        .type("Link")
        .validations([{ linkContentType: ["inputBanner"] }])
        .linkType("Entry");
      currentContentType.changeFieldControl(
        "inputBanner",
        "builtin",
        "entryLinkEditor"
      );
    }
  });
};

"use strict";

const pageContentTypes = [
  "page",
  "homePage",
  "teamPage",
  "contactUsPage",
  "productListerPage",
  "documentLibraryPage",
  "resources",
  "brandLandingPage"
];

module.exports.description =
  "Link signup block entity for the following pages: " +
  pageContentTypes.join(", ");

module.exports.up = (migration) => {
  pageContentTypes.forEach((contentType) => {
    const currentContentType = migration.editContentType(contentType);
    if (contentType === "resources") {
      currentContentType.deleteField("pdpInputBanner");
    } else {
      currentContentType.deleteField("inputBanner");
    }
  });
};

module.exports.down = (migration) => {
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

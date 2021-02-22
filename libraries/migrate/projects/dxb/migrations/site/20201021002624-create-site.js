module.exports.description = "Create content model for Site";

module.exports.up = (migration) => {
  const site = migration
    .createContentType("site")
    .name("Site")
    .displayField("countryCode")
    .description("There should be one Site per market");

  site
    .createField("countryCode")
    .name("Country Code")
    .type("Symbol")
    .required(true)
    .validations([{ unique: true }]);

  site
    .createField("menuUtilities")
    .name("MenuUtilities")
    .type("Link")
    .validations([{ linkContentType: ["navigation"] }])
    .linkType("Entry");

  site
    .createField("menuNavigation")
    .name("MenuNavigation")
    .type("Link")
    .required(true)
    .validations([{ linkContentType: ["navigation"] }])
    .linkType("Entry");

  site
    .createField("homePage")
    .name("Home Page")
    .type("Link")
    .required(true)
    .validations([{ linkContentType: ["homePage"] }])
    .linkType("Entry");

  site
    .createField("pages")
    .name("Pages")
    .type("Array")
    .items({
      type: "Link",
      validations: [
        { linkContentType: ["contactUsPage", "homePage", "page", "teamPage"] }
      ],
      linkType: "Entry"
    });

  site
    .createField("footerMainNavigation")
    .name("Footer Main Navigation")
    .type("Link")
    .validations([{ linkContentType: ["navigation"] }])
    .linkType("Entry");

  site
    .createField("footerSecondaryNavigation")
    .name("Footer Secondary Navigation")
    .type("Link")
    .validations([{ linkContentType: ["navigation"] }])
    .linkType("Entry");

  site
    .createField("resources")
    .name("Resources")
    .type("Array")
    .items({ type: "Link", validations: [], linkType: "Entry" });

  site
    .createField("signUpTitle")
    .name("Sign Up Title")
    .type("Symbol")
    .required(true);

  site
    .createField("signUpDescription")
    .name("Sign Up Description")
    .type("Text")
    .required(true);

  site
    .createField("signUpInputLabel")
    .name("Sign Up Input Label")
    .type("Symbol")
    .required(true);

  site
    .createField("signUpCallToAction")
    .name("Sign Up Call To Action")
    .type("Symbol")
    .required(true);

  site.changeFieldControl("countryCode", "builtin", "singleLine");
  site.changeFieldControl("menuUtilities", "builtin", "entryLinkEditor");
  site.changeFieldControl("menuNavigation", "builtin", "entryLinkEditor");
  site.changeFieldControl("homePage", "builtin", "entryLinkEditor");
  site.changeFieldControl("pages", "builtin", "entryLinksEditor");
  site.changeFieldControl("footerMainNavigation", "builtin", "entryLinkEditor");
  site.changeFieldControl(
    "footerSecondaryNavigation",
    "builtin",
    "entryLinkEditor"
  );
  site.changeFieldControl("resources", "builtin", "entryLinksEditor");
  site.changeFieldControl("signUpTitle", "builtin", "singleLine");
  site.changeFieldControl("signUpDescription", "builtin", "markdown");
  site.changeFieldControl("signUpInputLabel", "builtin", "singleLine");
  site.changeFieldControl("signUpCallToAction", "builtin", "singleLine");
};

module.exports.down = (migration) => migration.deleteContentType("site");

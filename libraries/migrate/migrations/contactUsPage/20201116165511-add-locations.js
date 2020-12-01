module.exports.description =
  "Add a location field that links to multiple contactDetails entries.";

module.exports.up = (migration) => {
  const contactUsPage = migration.editContentType("contactUsPage");

  contactUsPage
    .createField("locationsTitle")
    .name("Locations Title")
    .type("Symbol");

  contactUsPage
    .createField("locations")
    .name("Locations")
    .type("Array")
    .items({
      type: "Link",
      validations: [{ linkContentType: ["contactDetails"] }],
      linkType: "Entry"
    });

  contactUsPage.moveField("locationsTitle").afterField("queriesSubtitle");
  contactUsPage.moveField("locations").afterField("locationsTitle");
};

module.exports.down = (migration) => {
  const contactUsPage = migration.editContentType("contactUsPage");
  contactUsPage.deleteField("locations");
  contactUsPage.deleteField("locationsTitle");
};

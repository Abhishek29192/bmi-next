module.exports.description = "Add next best actions field to page content type";

module.exports.up = (migration) => {
  const page = migration.editContentType("page");

  page
    .createField("nextBestActions")
    .name("Next best actions")
    .type("Array")
    .validations([{ size: { max: 4 } }])
    .items({
      type: "Link",
      validations: [
        {
          linkContentType: [
            "promo",
            "page",
            "productListerPage",
            "contactUsPage",
            "teamPage"
          ]
        }
      ],
      linkType: "Entry"
    });

  page.changeFieldControl("nextBestActions", "builtin", "entryLinksEditor");
  page.moveField("nextBestActions").afterField("sections");
};

module.exports.down = (migration) => {
  const page = migration.editContentType("page");

  page.deleteField("nextBestActions");
};

module.exports.description = "<Put your description here>";

module.exports.up = (migration) => {
  const contactDetails = migration
    .createContentType("contactDetails")
    .name("Contact Details")
    .displayField("title")
    .description("");

  contactDetails
    .createField("title")
    .name("Title")
    .type("Symbol")
    .required(true);

  contactDetails.createField("address").name("Address").type("Symbol");
  contactDetails.createField("email").name("Email").type("Symbol");
  contactDetails.createField("phoneNumber").name("Phone Number").type("Symbol");

  contactDetails
    .createField("otherInformation")
    .name("Other Information")
    .type("RichText")
    .validations([
      { enabledMarks: ["bold"], message: "Only bold marks are allowed" },
      {
        enabledNodeTypes: ["heading-2"],
        message: "Only heading 2 nodes are allowed"
      },
      { nodes: {} }
    ]);
};

module.exports.down = (migration) => {
  migration.deleteContentType("contactDetails");
};

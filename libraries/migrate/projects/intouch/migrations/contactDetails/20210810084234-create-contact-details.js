module.exports.description = "Create content model for Contact Details";

module.exports.up = (migration) => {
  const contactDetails = migration
    .createContentType("contactDetails")
    .name("Contact Details")
    .displayField("fullName")
    .description("Contact details that appear as cards on the Company Page");

  contactDetails
    .createField("fullName")
    .name("Full Name")
    .type("Symbol")
    .required(true)
    .validations([{ unique: true }]);

  contactDetails
    .createField("subHeading")
    .name("Sub-Heading")
    .type("Symbol")
    .required(true);

  contactDetails
    .createField("email")
    .name("Email")
    .type("Symbol")
    .required(true)
    .validations([
      { regexp: { pattern: "^\\w[\\w.-]*@([\\w-]+\\.)+[\\w-]+$" } }
    ]);

  contactDetails.createField("phoneNumber").name("Phone Number").type("Symbol");

  contactDetails.changeFieldControl("fullName", "builtin", "singleLine");
  contactDetails.changeFieldControl("subHeading", "builtin", "singleLine");
  contactDetails.changeFieldControl("email", "builtin", "singleLine");
  contactDetails.changeFieldControl("phoneNumber", "builtin", "singleLine");
};

module.exports.down = (migration) =>
  migration.deleteContentType("contactDetails");

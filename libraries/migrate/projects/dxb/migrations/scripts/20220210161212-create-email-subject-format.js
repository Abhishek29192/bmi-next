module.exports.description = "Add email subject format";

module.exports.up = (migration) => {
  const form = migration.editContentType("form");
  form
    .createField("emailSubjectFormat")
    .name("Email Subject Format")
    .type("Symbol");

  form.changeFieldControl("emailSubjectFormat", "builtin", "singleLine", {
    helpText:
      "Add a reference subject line for the internal recipient (BMI) of the form enquiry."
  });
};

module.exports.down = (migration) =>
  migration.editContentType("form").deleteField("emailSubjectFormat");

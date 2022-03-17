module.exports.description = "Edit the recipients field for form";

module.exports.up = (migration) => {
  const form = migration.editContentType("form");

  form.changeFieldControl("recipients", "builtin", "singleLine", {
    helpText:
      'Enter a valid BMI email address. You can provide multiple emails using comma "," as a separator'
  });
};

module.exports.down = (migration) => {
  const form = migration.editContentType("form");

  form.changeFieldControl("recipients", "builtin", "singleLine", {
    helpText: "Enter a valid BMI email address."
  });
};

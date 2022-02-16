module.exports.description = "Change recipients validation pattern";

module.exports.up = (migration) => {
  const form = migration.editContentType("form");
  form.editField("recipients").validations([
    {
      regexp: { pattern: "^(?:\\b[\\w\\d@.]+\\b[\\s,]*){1,4}$" },
      message: "You should provide up to 4 valid emails"
    }
  ]);
};

module.exports.down = (migration) => {
  const form = migration.editContentType("form");
  form.editField("recipients").validations([
    {
      regexp: { pattern: "^(?:\b[w@.]+\b[s,]*){1,4}$" },
      message: "You should provide up to 4 valid emails"
    }
  ]);
};

module.exports.description = "Create content model for Range Value";

module.exports.up = (migration) => {
  const rangeValue = migration
    .createContentType("rangeValue")
    .name("Range Value")
    .description("");

  rangeValue.createField("start").name("Start").type("Number");

  rangeValue.createField("end").name("End").type("Number");

  rangeValue.createField("value").name("Value").type("Number");

  rangeValue.changeFieldControl("start", "builtin", "numberEditor");
  rangeValue.changeFieldControl("end", "builtin", "numberEditor");
  rangeValue.changeFieldControl("value", "builtin", "numberEditor");
};

module.exports.down = (migration) => migration.deleteContentType("rangeValue");

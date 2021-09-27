module.exports.description =
  "Add merchant type field to select one or more systems stocked by that Type of Merchant";

module.exports.up = (migration) => {
  const roofer = migration.editContentType("roofer");
  roofer
    .createField("merchantType")
    .name("Type of Merchant")
    .type("Array")
    .items({
      type: "Symbol",
      validations: [
        {
          in: [
            "Merchant Type 1",
            "Merchant Type 2",
            "Merchant Type 3",
            "Merchant Type 4",
            "Merchant Type 5"
          ]
        }
      ]
    });

  roofer.changeFieldControl("merchantType", "builtin", "checkbox");
};

module.exports.down = (migration) => {
  const roofer = migration.editContentType("roofer");
  roofer.deleteField("merchantType");
};

module.exports.description = "Update tierAvailable list";

module.exports.up = (migration) => {
  const guaranteeType = migration.editContentType("guaranteeType");

  guaranteeType.editField("tiersAvailable").items({
    type: "Symbol",
    validations: [{ in: ["T1", "T2", "T3", "T4", "T5", "T6", "T7"] }]
  });
};

module.exports.down = (migration) => {
  const guaranteeType = migration.editContentType("guaranteeType");

  guaranteeType
    .editField("tiersAvailable")
    .items({ type: "Symbol", validations: [{ in: ["T1", "T2", "T3", "T4"] }] });
};

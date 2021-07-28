module.exports.description = "Changed required status of is reversed field";

module.exports.up = (migration) => {
  const syndicateSection = migration.editContentType("villainSection");
  syndicateSection.editField("isReversed").required(true);
};

module.exports.down = (migration) => {
  const syndicateSection = migration.editContentType("villainSection");
  syndicateSection.editField("isReversed").required(false);
};

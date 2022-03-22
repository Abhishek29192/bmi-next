module.exports.description = "Enable team members in response";

module.exports.up = (migration) => {
  const teamCategory = migration.editContentType("teamCategory");

  teamCategory.editField("teamMembers").disabled(false).omitted(false);
};

module.exports.down = (migration) => {
  const teamCategory = migration.editContentType("teamCategory");

  teamCategory.editField("teamMembers").disabled(false).omitted(true);
};

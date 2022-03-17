module.exports.description = "Delete category from team member";

module.exports.up = (migration) => {
  const teamMember = migration.editContentType("teamMember");

  teamMember.deleteField("category");
};

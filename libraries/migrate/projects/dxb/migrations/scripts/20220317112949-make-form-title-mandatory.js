module.exports.description = 'Make field "Form title" mandatory';

module.exports.up = (migration) => {
  const form = migration.editContentType("form");
  form.editField("title").required(true);
};

module.exports.down = (migration) => {
  const form = migration.editContentType("form");
  form.editField("title").required(false);
};

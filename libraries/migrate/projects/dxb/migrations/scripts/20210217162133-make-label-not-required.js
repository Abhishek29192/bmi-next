module.exports.description = "Make label field not required";

module.exports.up = (migration) => {
  const serviceLocatorSection = migration.editContentType(
    "serviceLocatorSection"
  );
  serviceLocatorSection.editField("label").required(false);
};

module.exports.down = (migration) => {
  const serviceLocatorSection = migration.editContentType(
    "serviceLocatorSection"
  );
  serviceLocatorSection.editField("label").required(true);
};

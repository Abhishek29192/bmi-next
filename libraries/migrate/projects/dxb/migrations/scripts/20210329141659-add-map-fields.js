module.exports.description = "Add map centre and zoom fields for initial state";

module.exports.up = (migration) => {
  const serviceLocatorSection = migration.editContentType(
    "serviceLocatorSection"
  );

  serviceLocatorSection
    .createField("centre")
    .name("Map Centre")
    .type("Location");

  serviceLocatorSection.changeFieldControl(
    "centre",
    "builtin",
    "locationEditor",
    {
      helpText: `Please pick the centre of the map. You can enter the country name of your market (e.g. "Norway").`
    }
  );

  serviceLocatorSection
    .createField("zoom")
    .name("Map Zoom")
    .type("Integer")
    .validations([{ range: { min: 0, max: 20 } }]);

  serviceLocatorSection.changeFieldControl("zoom", "builtin", "numberEditor", {
    helpText: `Please enter a number between 0 and 20 (the default is 5). For more information on zoom levels see: https://developers.google.com/maps/documentation/maps-static/start#Zoomlevels`
  });
};

module.exports.down = (migration) => {
  const serviceLocatorSection = migration.editContentType(
    "serviceLocatorSection"
  );

  serviceLocatorSection.deleteField("centre");
  serviceLocatorSection.deleteField("zoom");
};

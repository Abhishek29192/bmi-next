module.exports.description = "Add useful text to Country Code";

module.exports.up = (migration) => {
  const contentTopic = migration.editContentType("site");

  contentTopic.changeFieldControl("countryCode", "builtin", "singleLine", {
    helpText:
      "The Country Code is used to define the root country for a market, Changing it will make the entire market’s website unreachable. DO NOT PROCEED unless the change has been authorised."
  });
};

module.exports.down = (migration) => {
  const contentTopic = migration.editContentType("site");

  contentTopic.changeFieldControl("countryCode", "builtin", "singleLine", {
    helpText: ""
  });
};

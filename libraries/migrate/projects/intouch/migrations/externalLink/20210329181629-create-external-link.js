module.exports.description = "Create content model for External Link";

module.exports.up = (migration) => {
  const externalLink = migration
    .createContentType("externalLink")
    .name("External Link")
    .displayField("displayText")
    .description(
      "A hyperlink. There are up to two external links that are configurable by the Markets. In Italy this is used for the merits programme.  In Denmark they use it to direct people back to the BMI country website.  The links only appear on the homepage."
    );

  externalLink
    .createField("url")
    .name("URL")
    .type("Symbol")
    .required(true)
    .validations([
      { unique: true },
      {
        regexp: {
          pattern:
            "^(ftp|http|https):\\/\\/(\\w+:{0,1}\\w*@)?(\\S+)(:[0-9]+)?(\\/|\\/([\\w#!:.?+=&%@!\\-/]))?$"
        },
        message: "Must be an http or https URL"
      }
    ]);

  externalLink
    .createField("displayText")
    .name("DisplayText")
    .type("Symbol")
    .required(true);

  externalLink.changeFieldControl("url", "builtin", "urlEditor");
  externalLink.changeFieldControl("displayText", "builtin", "singleLine", {
    helpText: "The text displayed to the end user"
  });
};

module.exports.down = (migration) =>
  migration.deleteContentType("externalLink");

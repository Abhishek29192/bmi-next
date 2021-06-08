module.exports.description = "Create content model for Tile Verge Option";

module.exports.up = (migration) => {
  const tileVergeOption = migration
    .createContentType("tileVergeOption")
    .name("Tile Verge Option")
    .displayField("name")
    .description("");

  tileVergeOption
    .createField("name")
    .name("Name")
    .type("Symbol")
    .required(true);

  tileVergeOption
    .createField("left")
    .name("Left")
    .type("Link")
    .validations([{ linkContentType: ["vergeTile"] }])
    .linkType("Entry");

  tileVergeOption
    .createField("right")
    .name("Right")
    .type("Link")
    .validations([{ linkContentType: ["vergeTile"] }])
    .linkType("Entry");

  tileVergeOption
    .createField("halfLeft")
    .name("Half Left")
    .type("Link")
    .validations([{ linkContentType: ["halfVergeTile"] }])
    .linkType("Entry");

  tileVergeOption
    .createField("halfRight")
    .name("Half Right")
    .type("Link")
    .validations([{ linkContentType: ["halfVergeTile"] }])
    .linkType("Entry");

  tileVergeOption.changeFieldControl("name", "builtin", "singleLine");
  tileVergeOption.changeFieldControl("left", "builtin", "entryLinkEditor");
  tileVergeOption.changeFieldControl("right", "builtin", "entryLinkEditor");
  tileVergeOption.changeFieldControl("halfLeft", "builtin", "entryLinkEditor");
  tileVergeOption.changeFieldControl("halfRight", "builtin", "entryLinkEditor");
};

module.exports.down = (migration) =>
  migration.deleteContentType("tileVergeOption");

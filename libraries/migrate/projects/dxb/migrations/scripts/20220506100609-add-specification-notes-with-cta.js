module.exports.description = "Add specification notes with CTA content type";

module.exports.up = (migration) => {
  const specificationNotes = migration
    .createContentType("specificationNotes")
    .name("Specification Notes With CTA")
    .displayField("name")
    .description("");

  specificationNotes
    .createField("name")
    .name("Name")
    .type("Symbol")
    .required(true);
  specificationNotes.createField("title").name("Title").type("Symbol");
  specificationNotes
    .createField("description")
    .name("Description")
    .type("RichText");
  specificationNotes
    .createField("cta")
    .name("CTA")
    .type("Link")
    .validations([{ linkContentType: ["link"] }])
    .linkType("Entry");

  const resources = migration.editContentType("resources");
  resources
    .createField("sdpSpecificationNotes")
    .name("System Details Page: Specification Notes With CTA")
    .type("Link")
    .validations([{ linkContentType: ["specificationNotes"] }])
    .linkType("Entry");
};

module.exports.down = (migration) => {
  migration.deleteContentType("specificationNotes");
  const resources = migration.editContentType("resources");
  resources.deleteField(field);
};

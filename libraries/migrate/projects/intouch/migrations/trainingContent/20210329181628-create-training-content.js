module.exports.description = "Create content model for Training Content";

module.exports.up = (migration) => {
  const trainingContent = migration
    .createContentType("trainingContent")
    .name("Training Content")
    .displayField("pageHeading")
    .description("");

  trainingContent
    .createField("pageHeading")
    .name("Page Heading")
    .type("Symbol")
    .required(true);

  trainingContent
    .createField("description")
    .name("Description")
    .type("Text")
    .required(true);

  trainingContent
    .createField("lmsCtaLabel")
    .name("LMS CTA Label")
    .type("Symbol")
    .required(true);

  trainingContent
    .createField("customCtaLabel")
    .name("Custom CTA Label")
    .type("Symbol")
    .required(true);

  trainingContent
    .createField("customCtaTarget")
    .name("Custom CTA Target")
    .type("Symbol")
    .required(true);

  trainingContent
    .createField("image")
    .name("Image")
    .type("Link")
    .required(true)
    .validations([{ linkContentType: ["imageSet"] }])
    .linkType("Entry");

  trainingContent
    .createField("pageSubHeading")
    .name("Page Sub-Heading")
    .type("Symbol")
    .required(true);

  trainingContent
    .createField("step1Heading")
    .name("Step 1 Heading")
    .type("Symbol")
    .required(true);

  trainingContent
    .createField("step1SubHeading")
    .name("Step 1 Sub-Heading")
    .type("Symbol")
    .required(true);

  trainingContent
    .createField("step1Description")
    .name("Step 1 Description")
    .type("Text")
    .required(true);

  trainingContent
    .createField("step2Heading")
    .name("Step 2 Heading")
    .type("Symbol")
    .required(true);

  trainingContent
    .createField("step2SubHeading")
    .name("Step 2 Sub-Heading")
    .type("Symbol")
    .required(true);

  trainingContent
    .createField("step2Description")
    .name("Step 2 Description")
    .type("Text")
    .required(true);

  trainingContent
    .createField("step3Heading")
    .name("Step 3 Heading")
    .type("Symbol")
    .required(true);

  trainingContent
    .createField("step3SubHeading")
    .name("Step 3 Sub-Heading")
    .type("Symbol")
    .required(true);

  trainingContent
    .createField("step3Description")
    .name("Step 3 Description")
    .type("Text")
    .required(true);

  trainingContent.changeFieldControl("pageHeading", "builtin", "singleLine");
  trainingContent.changeFieldControl("description", "builtin", "markdown");
  trainingContent.changeFieldControl("lmsCtaLabel", "builtin", "singleLine");
  trainingContent.changeFieldControl("customCtaLabel", "builtin", "singleLine");
  trainingContent.changeFieldControl(
    "customCtaTarget",
    "builtin",
    "singleLine"
  );
  trainingContent.changeFieldControl("image", "builtin", "entryLinkEditor");
  trainingContent.changeFieldControl("pageSubHeading", "builtin", "singleLine");
  trainingContent.changeFieldControl("step1Heading", "builtin", "singleLine");
  trainingContent.changeFieldControl(
    "step1SubHeading",
    "builtin",
    "singleLine"
  );
  trainingContent.changeFieldControl("step1Description", "builtin", "markdown");
  trainingContent.changeFieldControl("step2Heading", "builtin", "singleLine");
  trainingContent.changeFieldControl(
    "step2SubHeading",
    "builtin",
    "singleLine"
  );
  trainingContent.changeFieldControl("step2Description", "builtin", "markdown");
  trainingContent.changeFieldControl("step3Heading", "builtin", "singleLine");
  trainingContent.changeFieldControl(
    "step3SubHeading",
    "builtin",
    "singleLine"
  );
  trainingContent.changeFieldControl("step3Description", "builtin", "markdown");
};

module.exports.down = (migration) =>
  migration.deleteContentType("trainingContent");

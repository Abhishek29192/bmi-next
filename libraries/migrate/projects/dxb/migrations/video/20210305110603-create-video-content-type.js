module.exports.description = "Create Video content type";

module.exports.up = (migration) => {
  const video = migration
    .createContentType("video")
    .name("Video")
    .displayField("title");

  video.createField("title").name("Title").type("Symbol").required(true);

  video.createField("label").name("Label").type("Symbol").required(true);

  video.createField("subtitle").name("Subtitle").type("Symbol");

  video
    .createField("youtubeId")
    .name("YouTube ID")
    .type("Symbol")
    .required(true);

  video
    .createField("previewImage")
    .name("PreviewImage")
    .type("Link")
    .validations([{ linkMimetypeGroup: ["image"] }])
    .linkType("Asset");
};

module.exports.down = (migration) => {
  migration.deleteContentType("video");
};

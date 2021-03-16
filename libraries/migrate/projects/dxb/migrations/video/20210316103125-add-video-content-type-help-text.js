module.exports.description =
  "Add help text to all fields on Video content type.";

module.exports.up = (migration) => {
  const video = migration.editContentType("video");

  video.changeFieldControl("title", "builtin", "singleLine", {
    helpText: "Only used for Contentful"
  });

  video.changeFieldControl("label", "builtin", "singleLine", {
    helpText: "Used for Alt Text"
  });

  video.changeFieldControl("subtitle", "builtin", "singleLine", {
    helpText: "Displayed over the preview image, if applicable"
  });

  video.changeFieldControl("youtubeId", "builtin", "singleLine", {
    helpText: "e.g. https://www.youtube.com/watch?v=iWaq1ZvhH0M = iWaq1ZvhH0M"
  });

  video.changeFieldControl("previewImage", "builtin", "assetLinkEditor", {
    helpText:
      "The image to be displayed in the placeholder (if applicable). If not set, the default image selected by YouTube will be used."
  });
};

module.exports.down = (migration) => {
  const video = migration.editContentType("video");

  video.changeFieldControl("title", "builtin", "singleLine", {
    helpText: ""
  });

  video.changeFieldControl("label", "builtin", "singleLine", {
    helpText: ""
  });

  video.changeFieldControl("subtitle", "builtin", "singleLine", {
    helpText: ""
  });

  video.changeFieldControl("youtubeId", "builtin", "singleLine", {
    helpText: ""
  });

  video.changeFieldControl("previewImage", "builtin", "assetLinkEditor", {
    helpText: ""
  });
};

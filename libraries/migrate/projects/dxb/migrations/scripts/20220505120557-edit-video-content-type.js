module.exports.description = "Extend youtube video source type";

module.exports.up = (migration) => {
  const video = migration.editContentType("video");

  video.editField("youtubeId", {
    name: "YouTube ID or URL"
  });

  video.changeFieldControl("youtubeId", "builtin", "singleLine", {
    helpText:
      "YouTube videos may be attached using video URL or ID e.g. `https://www.youtube.com/watch?v=iWaq1ZvhH0M&t=13s` OR `iWaq1ZvhH0M`"
  });
};

module.exports.down = (migration) => {
  const video = migration.editContentType("video");

  video.editField("youtubeId", {
    name: "YouTube ID"
  });

  video.changeFieldControl("youtubeId", "builtin", "singleLine", {
    helpText: "e.g. https://www.youtube.com/watch?v=iWaq1ZvhH0M = iWaq1ZvhH0M"
  });
};

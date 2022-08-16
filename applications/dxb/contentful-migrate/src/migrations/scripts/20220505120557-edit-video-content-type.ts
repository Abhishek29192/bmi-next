import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Extend youtube video source type";

export const up: MigrationFunction = (migration: Migration) => {
  const video = migration.editContentType("video");

  video.editField("youtubeId", {
    type: "Symbol",
    name: "YouTube ID or URL"
  });

  video.changeFieldControl("youtubeId", "builtin", "singleLine", {
    helpText:
      "YouTube videos may be attached using video URL or ID e.g. `https://www.youtube.com/watch?v=iWaq1ZvhH0M&t=13s` OR `iWaq1ZvhH0M`"
  });
};

export const down: MigrationFunction = (migration: Migration) => {
  const video = migration.editContentType("video");

  video.editField("youtubeId", {
    type: "Symbol",
    name: "YouTube ID"
  });

  video.changeFieldControl("youtubeId", "builtin", "singleLine", {
    helpText: "e.g. https://www.youtube.com/watch?v=iWaq1ZvhH0M = iWaq1ZvhH0M"
  });
};

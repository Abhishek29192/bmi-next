import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Create Video content type";

export const up: MigrationFunction = (migration: Migration) => {
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

export const down: MigrationFunction = (migration: Migration) => {
  migration.deleteContentType("video");
};

import React from "react";
import { MediaTile, MediaTileProps } from "../MediaTile";
import { MediaGrid } from ".";

export default {
  title: "Media Grid",
  component: MediaGrid
};

const items = [
  {
    fileName: "Folder name",
    meta: "Folder",
    media: "#",
    url: "#"
  },
  {
    fileName: "File without thumbnail",
    meta: "256kb - Image",
    media: "https://source.unsplash.com/MjLrM8rVMC0/801x601/?architecture",
    url: "https://source.unsplash.com/MjLrM8rVMC0/801x601/?architecture"
  },
  {
    fileName: "Image",
    meta: "256kb - Image",
    media: "https://source.unsplash.com/MjLrM8rVMC0/799x500/?architecture",
    thumbnail: "https://source.unsplash.com/MjLrM8rVMC0/799x500/?architecture",
    url: "https://source.unsplash.com/MjLrM8rVMC0/799x500/?architecture"
  },
  {
    fileName: "Video",
    meta: "256kb - Video",
    media: "https://source.unsplash.com/MjLrM8rVMC0/550x400/?architecture",
    thumbnail: "https://source.unsplash.com/MjLrM8rVMC0/550x400/?architecture",
    url: "https://vimeo.com/424813433"
  }
];

export const Basic = () => (
  <MediaGrid>
    {items.map((item: MediaTileProps) => (
      <MediaTile
        fileName={item.fileName}
        meta={item.meta}
        key={item.fileName}
        thumbnail={item.thumbnail}
        media={item.media}
        url={item.url}
      />
    ))}
  </MediaGrid>
);

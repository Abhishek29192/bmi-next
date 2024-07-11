import React from "react";
import EmbeddedLink from "./EmbeddedLink";
import type { Data as LinkData } from "./link/types";

export type Settings = {
  theme?: "primary" | "secondary";
  backgroundTheme?: "light" | "dark";
};

const EmbeddedInline = ({
  data,
  ...settings
}: {
  data: LinkData;
} & Settings) => {
  if (data.__typename !== "Link") {
    return null;
  }

  return <EmbeddedLink fields={data} {...settings} />;
};

export default EmbeddedInline;

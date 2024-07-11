import React from "react";
import EmbeddedTable from "./EmbeddedTable";
import EmbeddedLink from "./EmbeddedLink";
import type { Data as LinkData } from "./link/types";
import type { TableFields as TableData } from "./EmbeddedTable";

export type Settings = {
  theme?: "primary" | "secondary";
  backgroundTheme?: "light" | "dark";
};

const EmbeddedBlock = ({
  fields,
  ...settings
}: {
  fields: LinkData | TableData;
} & Settings) => {
  if (fields.__typename === "Link") {
    return <EmbeddedLink fields={fields} {...settings} />;
  }

  return <EmbeddedTable fields={fields} />;
};

export default EmbeddedBlock;

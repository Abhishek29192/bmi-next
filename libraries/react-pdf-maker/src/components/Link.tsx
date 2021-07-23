import React from "react";
import extractDefinitions from "../extractDefinitions";
import { PDFNode } from "../types";

const Link = ({
  children,
  href: link,
  ...rest
}: {
  children: React.ReactNode[];
  href: string;
}): any => {
  return {
    text: (extractDefinitions(children) as PDFNode[]).join(""),
    link,
    ...rest
  };
};

export default Link;

import React from "react";
import extractDefinitions from "../extractDefinitions";
import { ComponentProps } from "../types";
import View from "./View";

const Col = ({ children, ...rest }: ComponentProps): any => {
  const definition = extractDefinitions(children);
  //  TODO: Should we add a stack anyway?
  if (
    definition !== null &&
    !Array.isArray(definition) &&
    typeof definition === "object"
  ) {
    return {
      ...definition,
      ...rest
    };
  }
  return <View {...rest}>{definition}</View>;
};

export default Col;

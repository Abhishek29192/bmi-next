import React from "react";
import * as ReactIs from "react-is";
import extractDefinitions from "./extractDefinitions";

const extendIfElement = (element, props, ...children) => {
  if (ReactIs.isElement(element)) {
    return React.cloneElement(element, props, ...children);
  }
  return element;
};

const extractExtended = (element, props, ...children) =>
  extractDefinitions(extendIfElement(element, props, ...children));

export default extractExtended;

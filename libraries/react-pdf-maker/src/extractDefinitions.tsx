import React from "react";
import * as ReactIs from "react-is";
import { PDFNode } from "./types";
import toArray from "./utils/toArray";

// Should use React.ReactFragment, it takes in Object, not a specific type.
// This means `props` does not exist on it from a typing point of view, even
// though it exists.
const fragmentToArray = (fragment: any) => {
  const {
    props: { children }
  } = fragment;
  // Single undefined doesn't look well
  return toArray(children, true);
};

const extractDefinitions = (element: React.ReactNode): PDFNode => {
  // For simplicity
  if (ReactIs.isFragment(element)) {
    element = fragmentToArray(element);
  }

  if (Array.isArray(element)) {
    return element.map(extractDefinitions);
  }

  // Return the definition
  if (!ReactIs.isElement(element)) {
    if (typeof element === "number" || typeof element === "boolean") {
      return `${element}`;
    }
    return element as PDFNode;
  }

  // TODO: consider using react-reconciler to enable most of react features
  const render = element.type;
  if (typeof render !== "function") {
    throw new Error(
      `Elements must be function components, found ${typeof render}, ${render}`
    );
  }

  if (render.prototype && render.prototype.isReactComponent) {
    throw new Error(
      `Elements must be function components, found a class component`
    );
  }

  return extractDefinitions((render as React.FunctionComponent)(element.props));
};

export default extractDefinitions;

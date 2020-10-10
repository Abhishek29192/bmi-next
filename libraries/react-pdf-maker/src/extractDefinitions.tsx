import React from "react";
import * as ReactIs from "react-is";
import toArray from "./utils/toArray";

const fragmentToArray = (fragment) => {
  const {
    props: { children }
  } = fragment;
  // Single undefined doesn't look well
  return toArray(children, true);
};

const extractDefinitions = (element) => {
  // For simplicity
  if (ReactIs.isFragment(element)) {
    element = fragmentToArray(element);
  }

  if (Array.isArray(element)) {
    return element.map(extractDefinitions);
  }

  // Return the definition
  if (!ReactIs.isElement(element)) {
    return element;
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

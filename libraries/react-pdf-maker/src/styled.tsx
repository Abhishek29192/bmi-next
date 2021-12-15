import React from "react";

const calculateStyle = (style, props) => {
  const calculatedStyle = {};

  for (const [key, value] of Object.entries(style)) {
    // eslint-disable-next-line security/detect-object-injection
    calculatedStyle[key] = typeof value === "function" ? value(props) : value;
  }

  return calculatedStyle;
};

// eslint-disable-next-line react/display-name
const styled = (Component) => (style) => (props) =>
  <Component {...calculateStyle(style, props)} {...props} />;

export default styled;

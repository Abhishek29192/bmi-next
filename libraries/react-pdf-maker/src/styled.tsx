import React from "react";

const calculateStyle = (style: any, props: any): any => {
  const calculatedStyle: { [key: string]: any } = {};

  for (const [key, value] of Object.entries(style)) {
    // eslint-disable-next-line security/detect-object-injection
    calculatedStyle[key] = typeof value === "function" ? value(props) : value;
  }

  return calculatedStyle;
};

const styled =
  // eslint-disable-next-line react/display-name
  (Component: any) => (style: any) => (props: any) =>
    <Component {...calculateStyle(style, props)} {...props} />;

export default styled;

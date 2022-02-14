import React, { createContext, CSSProperties } from "react";
import classnames from "classnames";
import styles from "./ColorPair.module.scss";

export type Colors =
  | "white"
  | "alabaster"
  | "pearl"
  | "storm"
  | "blue-100"
  | "magenta-100"
  | "aqua-100"
  | "orange-100"
  | "alert"
  | "black"
  | "charcoal"
  | "slate"
  | "blue-800"
  | "blue-900"
  | "teal-400"
  | "teal-500"
  | "magenta-400"
  | "magenta-500"
  | "purple-400"
  | "orange-500"
  | "error"
  | "color-theme-secondary-1"
  | "color-theme-secondary-2"
  | "color-theme-secondary-3"
  | "color-theme-secondary-4";

const lightThemes: Colors[] = [
  "white",
  "alabaster",
  "pearl",
  "storm",
  "blue-100",
  "magenta-100",
  "aqua-100",
  "orange-100",
  "alert"
];

export const darkThemes: Colors[] = [
  "black",
  "charcoal",
  "slate",
  "blue-800",
  "blue-900",
  "teal-400",
  "teal-500",
  "magenta-400",
  "magenta-500",
  "purple-400",
  "orange-500",
  "error",
  "color-theme-secondary-1",
  "color-theme-secondary-2",
  "color-theme-secondary-3",
  "color-theme-secondary-4"
];
export const availableThemes = [...lightThemes, ...darkThemes];

type Context = {
  type?: "dark" | "light";
  theme?: Colors;
};

type Props = {
  theme?: Colors;
  className?: string;
  children: React.ReactNode;
  markupComponent?: React.ElementType;
  style?: CSSProperties;
};

export const ColorPairContext = createContext<Context>({});

const ColorPair = ({
  theme = "white",
  className,
  children,
  markupComponent: MarkupComponent = "div",
  ...rest
}: Props) => {
  /* istanbul ignore next */
  if (
    process.env.NODE_ENV === "development" &&
    !availableThemes.includes(theme)
  ) {
    // eslint-disable-next-line no-console
    console.warn(
      `ColorPair: The theme ${theme} used doesn't exist in the CSS classes. Check there isn't any misalignment between TS and CSS. Available themes are ${availableThemes.join(
        ", "
      )}`
    );
  }

  return (
    <MarkupComponent
      className={classnames(
        className,
        styles["ColorPair"],
        styles[`ColorPair--${theme}`]
      )}
      {...rest}
    >
      <ColorPairContext.Provider
        value={{ type: darkThemes.includes(theme) ? "dark" : "light", theme }}
      >
        {children}
      </ColorPairContext.Provider>
    </MarkupComponent>
  );
};

export default ColorPair;

export const withColorPair = <P extends Omit<Props, "markupComponent">>(
  Component: React.ComponentType<P>
) => {
  const ComponentWithColorPair = (props: P) => {
    return <ColorPair markupComponent={Component} {...props} />;
  };

  ComponentWithColorPair.displayName = `${
    Component.displayName || "Component"
  }WithColorPair`;

  return ComponentWithColorPair;
};

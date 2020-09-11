import React from "react";
import styles from "./ColorPair.module.scss";
import classnames from "classnames";

export type Colors =
  | "white"
  | "pearl"
  | "storm"
  | "blue-100"
  | "magenta-100"
  | "aqua-100"
  | "orange-100"
  | "alert"
  | "black"
  | "charocal"
  | "blue-800"
  | "blue-900"
  | "teal-400"
  | "teal-500"
  | "magenta-400"
  | "magenta-500"
  | "purple-400"
  | "orange-500";

const getThemesFromSassVariable = (theme: string): string[] => {
  return theme.replace(/"/g, "").split(", ");
};

export const availableThemes = [
  ...getThemesFromSassVariable(styles["light-theme"]),
  ...getThemesFromSassVariable(styles["dark-theme"])
] as Colors[];

type Props = {
  theme?: Colors;
  className?: string;
  children: React.ReactNode;
  markupComponent?: React.ElementType;
};

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
      {children}
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

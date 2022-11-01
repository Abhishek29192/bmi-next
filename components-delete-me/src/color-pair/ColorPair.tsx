import React, { createContext, CSSProperties } from "react";
import classnames from "classnames";
import { makeStyles } from "@material-ui/styles";
import { ThemeOptions } from "../theme-provider";

export type Colors =
  | "white"
  | "alabaster"
  | "pearl"
  | "storm"
  | "blue100"
  | "magenta100"
  | "aqua100"
  | "orange100"
  | "alert"
  | "black"
  | "charcoal"
  | "slate"
  | "blue800"
  | "blue900"
  | "teal400"
  | "teal500"
  | "magenta400"
  | "magenta500"
  | "purple400"
  | "orange500"
  | "error"
  | "secondary1"
  | "secondary2"
  | "secondary3"
  | "secondary4";

const lightThemes: Colors[] = [
  "white",
  "alabaster",
  "pearl",
  "storm",
  "blue100",
  "magenta100",
  "aqua100",
  "orange100",
  "alert"
];

export const darkThemes: Colors[] = [
  "black",
  "charcoal",
  "slate",
  "blue800",
  "blue900",
  "teal400",
  "teal500",
  "magenta400",
  "magenta500",
  "purple400",
  "orange500",
  "error",
  "secondary1",
  "secondary2",
  "secondary3",
  "secondary4"
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

const useStyles = makeStyles(
  (theme: ThemeOptions) => ({
    root: {
      backgroundColor: theme.colours.white,
      color: theme.colours.charcoal,
      "-webkit-print-color-adjust": "exact"
    },
    white: {
      backgroundColor: theme.colours.white,
      color: theme.colours.charcoal
    },
    pearl: {
      backgroundColor: theme.colours.pearl,
      color: theme.colours.charcoal
    },
    storm: {
      backgroundColor: theme.colours.storm,
      color: theme.colours.charcoal
    },
    blue100: {
      backgroundColor: theme.colours.blue100,
      color: theme.colours.charcoal
    },
    magenta100: {
      backgroundColor: theme.colours.magenta100,
      color: theme.colours.charcoal
    },
    aqua100: {
      backgroundColor: theme.colours.aqua100,
      color: theme.colours.charcoal
    },
    orange100: {
      backgroundColor: theme.colours.orange100,
      color: theme.colours.charcoal
    },
    alert: {
      backgroundColor: theme.colours.alert,
      color: theme.colours.charcoal
    },
    alabaster: {
      backgroundColor: theme.colours.alabaster,
      color: theme.colours.charcoal
    },
    black: { backgroundColor: theme.colours.black, color: theme.colours.white },
    charcoal: {
      backgroundColor: theme.colours.charcoal,
      color: theme.colours.white
    },
    slate: { backgroundColor: theme.colours.slate, color: theme.colours.white },
    blue800: {
      backgroundColor: theme.colours.blue800,
      color: theme.colours.white
    },
    blue900: {
      backgroundColor: theme.colours.blue900,
      color: theme.colours.white
    },
    teal400: {
      backgroundColor: theme.colours.teal400,
      color: theme.colours.white
    },
    teal500: {
      backgroundColor: theme.colours.teal500,
      color: theme.colours.white
    },
    magenta400: {
      backgroundColor: theme.colours.magenta400,
      color: theme.colours.white
    },
    magenta500: {
      backgroundColor: theme.colours.magenta500,
      color: theme.colours.white
    },
    purple400: {
      backgroundColor: theme.colours.purple400,
      color: theme.colours.white
    },
    orange500: {
      backgroundColor: theme.colours.orange500,
      color: theme.colours.white
    },
    error: { backgroundColor: theme.colours.error, color: theme.colours.white },
    secondary1: {
      backgroundColor: theme.colours.secondary1,
      color: theme.colours.white
    },
    secondary2: {
      backgroundColor: theme.colours.secondary2,
      color: theme.colours.white
    },
    secondary3: {
      backgroundColor: theme.colours.secondary3,
      color: theme.colours.white
    },
    secondary4: {
      backgroundColor: theme.colours.secondary4,
      color: theme.colours.white
    }
  }),
  { name: "ColorPair" }
);

const ColorPair = ({
  theme = "white",
  className,
  children,
  markupComponent: MarkupComponent = "div",
  ...rest
}: Props) => {
  const classes = useStyles();

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
      /* eslint-disable-next-line security/detect-object-injection */
      className={classnames(className, classes.root, classes[theme])}
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

// Not used
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

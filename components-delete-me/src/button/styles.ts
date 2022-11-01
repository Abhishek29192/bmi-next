import { alpha, makeStyles } from "@material-ui/core";
import { ThemeOptions } from "../theme-provider";

export const useButtonStyles = makeStyles(
  ({ colours }: ThemeOptions) => ({
    root: {
      fontSize: "1rem",
      borderRadius: 3,
      overflowWrap: "anywhere"
    },
    text: {
      "&:hover": {
        backgroundColor: alpha(colours.black, 0.05)
      }
    },
    contained: {
      "&.Mui-disabled": {
        backgroundColor: alpha(colours.inter, 0.38),
        color: colours.white
      }
    },
    label: {
      textTransform: "none"
    },
    startIcon: {
      marginLeft: 0
    },
    // custom classes
    textDarkBg: {
      color: alpha(colours.white, 0.8),

      "&:hover": {
        color: colours.white,
        backgroundColor: alpha(colours.white, 0.1),
        transition: "color 0.35s ease-in-out"
      },
      "&.Mui-disabled": {
        color: alpha(colours.white, 0.38)
      }
    },
    outlinedDarkBg: {
      color: colours.white,
      borderColor: alpha(colours.white, 0.8),
      backgroundColor: alpha(colours.white, 0.1),
      "&:hover": {
        borderColor: colours.white,
        backgroundColor: "transparent"
      },
      "&.Mui-disabled": {
        color: alpha(colours.white, 0.3),
        backgroundColor: alpha(colours.white, 0.2),
        borderColor: alpha(colours.white, 0.3)
      }
    },
    opaqueOutlined: {
      backgroundColor: colours.white,
      position: "relative",
      "&:hover": {
        backgroundColor: colours.white,
        position: "relative",
        "&::after": {
          content: "''",
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          backgroundColor: alpha(colours.focus, 0.04)
        }
      },
      "&.Mui-disabled": {
        backgroundColor: colours.white
      }
    },
    opaqueOutlinedDarkBg: {
      color: colours.interDark,
      borderColor: alpha(colours.interDark, 0.5),
      "&:hover": {
        borderColor: colours.interDark,
        "&::after": {
          backgroundColor: alpha(colours.interDark, 0.04)
        }
      }
    },
    containedDarkBg: {
      backgroundColor: colours.interDark,
      "&:hover": {
        backgroundColor: colours.focusDark
      },
      "&.Mui-disabled": {
        backgroundColor: alpha(colours.interDark, 0.38)
      }
    }
  }),
  { name: "Button" }
);

export const useIconButtonStyles = makeStyles(
  ({ colours }: ThemeOptions) => {
    const iconButtonBuffer = (margin: number | string) => ({
      "&::after": {
        content: "''",
        position: "absolute",
        top: -margin,
        left: -margin,
        bottom: -margin,
        right: -margin
      }
    });
    return {
      root: {
        borderRadius: 3,
        padding: 0,
        "&:hover": {
          backgroundColor: colours.focus
        },
        "&.Mui-disabled": {
          backgroundColor: alpha(colours.focus, 0.35)
        }
      },
      contained: {
        backgroundColor: colours.inter,
        color: colours.white
      },
      text: {
        backgroundColor: "none",
        color: "currentColor",
        "&:hover": {
          backgroundColor: alpha(colours.white, 0.05)
        }
      },
      textDark: {
        color: colours.white,
        "&:hover": {
          backgroundColor: alpha(colours.white, 0.1)
        }
      },
      "extra-small": {
        maxWidth: 24,
        maxHeight: 24,
        ...iconButtonBuffer(12)
      },
      small: {
        maxWidth: 32,
        maxHeight: 32,
        ...iconButtonBuffer(8)
      },
      42: {
        width: 42,
        height: 42
      },
      medium: {
        width: 48,
        height: 48
      },
      large: {
        width: 60,
        height: 60
      },
      "extra-large": {
        width: 64,
        height: 64
      }
    };
  },
  { name: "IconButton" }
);

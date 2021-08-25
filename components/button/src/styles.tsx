import { makeStyles, fade } from "@material-ui/core/styles";
import variables from "./Button.module.scss";

export const useButtonStyles = makeStyles(
  ({ palette }) => ({
    root: {
      fontSize: "1rem",
      borderRadius: 3,
      overflowWrap: "anywhere"
    },
    text: {
      "&:hover": {
        backgroundColor: fade(variables["color-black"]!, 0.05)
      }
    },
    contained: {
      "&.Mui-disabled": {
        backgroundColor: fade(palette.primary.main, 0.38),
        color: variables["color-white"]
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
      color: fade(variables["color-white"]!, 0.8),

      "&:hover": {
        color: variables["color-white"],
        backgroundColor: fade(variables["color-white"]!, 0.1),
        transition: "color 0.35s ease-in-out"
      },
      "&.Mui-disabled": {
        color: fade(variables["color-white"]!, 0.38)
      }
    },
    outlinedDarkBg: {
      color: variables["color-white"],
      borderColor: fade(variables["color-white"]!, 0.8),
      backgroundColor: fade(variables["color-white"]!, 0.1),
      "&:hover": {
        borderColor: variables["color-white"],
        backgroundColor: "transparent"
      },
      "&.Mui-disabled": {
        color: fade(variables["color-white"]!, 0.3),
        backgroundColor: fade(variables["color-white"]!, 0.2),
        borderColor: fade(variables["color-white"]!, 0.3)
      }
    },
    coloredOutlinedDarkBg: {
      color: variables["color-inter-dark"],
      borderColor: variables["color-outlined-dark-border"],
      backgroundColor: variables["color-white"],
      position: "relative",
      "&:hover": {
        backgroundColor: variables["color-white"],
        borderColor: variables["color-inter-dark"],
        position: "relative",
        "&:after": {
          content: "''",
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          backgroundColor: variables["color-outlined-hovered-dark-bg"]
        }
      },
      "&.Mui-disabled": {
        backgroundColor: variables["color-white"]
      }
    },
    containedDarkBg: {
      backgroundColor: variables["color-inter-dark"],
      "&:hover": {
        backgroundColor: variables["color-focus-dark"]
      },
      "&.Mui-disabled": {
        backgroundColor: variables["color-disabled-contained-dark-bg"]
      }
    }
  }),
  { classNamePrefix: "buttonStyles" }
);

export const useIconButtonStyles = makeStyles(
  ({ palette }) => {
    const iconButtonBuffer = (margin: number | string) => ({
      "&:after": {
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
          backgroundColor: palette.primary.dark
        },
        "&.Mui-disabled": {
          backgroundColor: variables["disabled-icon-button"]
        }
      },
      contained: {
        backgroundColor: palette.primary.main,
        color: variables["color-white"]
      },
      text: {
        backgroundColor: "none",
        color: "currentColor",
        "&:hover": {
          backgroundColor: fade(variables["color-white"]!, 0.05)
        }
      },
      textDark: {
        color: variables["color-white"],
        "&:hover": {
          backgroundColor: fade(variables["color-white"]!, 0.1)
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
  { classNamePrefix: "iconButtonStyles" }
);

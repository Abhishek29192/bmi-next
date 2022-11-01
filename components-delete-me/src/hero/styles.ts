import { makeStyles } from "@material-ui/styles";
import { ThemeOptions } from "../theme-provider";

export const useStyles = makeStyles(
  (theme: ThemeOptions) => ({
    root: {
      minHeight: "auto",
      flexDirection: "column",
      backgroundColor: theme.colours.blue800,
      color: theme.colours.white,
      position: "relative",
      overflow: "hidden",
      [theme.breakpoints!.up!(769)]: {
        flexDirection: "row",
        height: "auto"
      }
    },
    slim: {
      [theme.breakpoints!.up!(769)]: {
        height: "auto",
        "&:not($carousel) $wrapper": {
          width: "auto"
        }
      },
      "& $wrapper": {
        paddingBottom: "8px"
      }
    },
    carousel: {
      [theme.breakpoints!.up!(769)]: {
        height: "650px",
        paddingBottom: "60px",
        "& $content": {
          paddingBottom: "32px"
        }
      },
      [theme.breakpoints!.up!("lg")]: {
        height: "650px"
      },
      [theme.breakpoints!.up!("xl")]: {
        height: "720px",
        "& $content": {
          paddingBottom: 0
        }
      }
    },
    keyline: {
      borderBottom: `12px solid ${theme.colours.accent}`,
      "&.Hero--lvl-1": {
        borderBottom: `8px solid ${theme.colours.accent}`
      },
      "&.Hero--lvl-2, &.Hero--lvl-3": {
        borderBottom: `4px solid ${theme.colours.accent}`
      }
    },
    spaceBottom: {
      [theme.breakpoints!.up!(769)]: {
        paddingBottom: "140px",
        "& $controls": {
          bottom: "124px"
        }
      }
    },
    container: {
      height: "100%"
    },
    wrapper: {
      display: "flex",
      width: "100%",
      minHeight: "auto",
      padding: "24px 0 40px 0",
      flexDirection: "column",
      [theme.breakpoints!.up!(769)]: {
        width: "calc(50% + 12px)",
        height: "100%",
        paddingRight: "24px"
      }
    },
    content: {
      height: "100%",
      marginTop: "auto",
      marginBottom: "auto",
      [theme.breakpoints!.up!(769)]: {
        marginTop: "auto",
        marginBottom: "auto"
      },
      [theme.breakpoints!.up!("xl")]: {
        paddingBottom: 0
      }
    },
    title: {
      margin: "10px 0 24px",
      // NOTE: This gets rid of the next line high characters
      lineHeight: "1.4em",
      "&::after": {
        // NOTE: Fix the next slide being visible
        marginLeft: "1px"
      },
      // NOTE: none of the headers are truncated on mobile
      [theme.breakpoints!.up!(769)]: {
        "-webkit-line-clamp": 2,
        "&::after": {
          display: "none !important"
        }
      }
    },
    text: {
      minHeight: "auto",
      width: "100%",
      fontSize: "18px",
      overflow: "hidden",
      display: "-webkit-box",
      "-webkit-box-orient": "vertical",
      [theme.breakpoints!.up!(769)]: {
        marginTop: "-10px",
        width: "100%",
        fontSize: "20.25px",
        "&::before": {
          backgroundColor: theme.colours.accent300,
          content: '""',
          display: "block",
          height: "4px",
          marginTop: "0.6rem",
          width: "100px",
          position: "relative",
          top: "-10px",
          marginBottom: "10px"
        }
      }
    },
    cta: {
      marginTop: "24px",
      display: "block",
      width: "fit-content",
      // NOTE: Fix the next slide being visible
      marginLeft: "1px"
    },
    controls: {
      margin: "24px 0 32px",
      [theme.breakpoints!.up!(769)]: {
        position: "absolute",
        zIndex: 3,
        right: "24px",
        bottom: "24px",
        margin: 0
      },
      [theme.breakpoints!.up!("lg")]: {
        margin: "24px 0 32px"
      },
      [theme.breakpoints!.up!("xl")]: {
        position: "static"
      }
    },
    children: {
      [theme.breakpoints!.up!("lg")]: {
        maxWidth: "566px"
      }
    },
    imageCarousel: {
      marginTop: "40px",
      [theme.breakpoints!.up!(769)]: {
        position: "absolute",
        top: 0,
        left: "calc(50% + 12px)",
        width: "calc(50vw - 12px)",
        height: "100%",
        maxHeight: "none",
        marginTop: 0,
        "&::after": {
          content: '""',
          position: "absolute",
          pointerEvents: "none",
          zIndex: 0,
          top: "50%",
          width: "100%",
          bottom: 0,
          background: `linear-gradient(to bottom, ${theme.colours.blue800}00 0%, ${theme.colours.blue800} 70%, ${theme.colours.blue800} 100%)`
        },
        "& $image": {
          position: "relative !important",
          width: "auto",
          height: "100%",
          left: 0
        }
      },
      [theme.breakpoints!.up!("xl")]: {
        "&::after": {
          content: "''"
        }
      }
    },
    image: {
      width: "100%",
      height: "500px",
      overflow: "hidden",
      "&::after": {
        content: '""',
        display: "block",
        paddingTop: "100%"
      },
      [theme.breakpoints!.up!(769)]: {
        position: "absolute !important",
        top: 0,
        left: "calc(50% + 12px)",
        width: "calc(50vw - 12px)",
        height: "100%",
        maxHeight: "none",
        "&::after": {
          content: "''"
        }
      }
    },
    light: {
      backgroundColor: theme.colours.pearl,
      color: theme.colours.charcoal,
      "& $title": {
        "-webkit-line-clamp": "inherit"
      }
    },
    lvl1: {
      [theme.breakpoints!.up!(769)]: {
        minHeight: "450px"
      }
    },
    lvl2: {},
    lvl3: {}
  }),
  { name: "Hero" }
);

import { makeStyles } from "@material-ui/styles";
import { ThemeOptions } from "../theme-provider";

export const useStyles = makeStyles(
  (theme: ThemeOptions) => ({
    root: {
      minHeight: "auto",
      color: theme.colours.white,
      position: "relative",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      "& + &": {
        marginTop: "24px"
      }
    },
    reversed: {
      flexDirection: "column-reverse"
    },
    grid: {
      flexWrap: "nowrap"
    },
    title: {
      marginBottom: "24px",
      "&::after": {
        // NOTE: Fix the next slide being visible
        marginLeft: "1px"
      }
    },
    container: {
      height: "100%",
      display: "flex",
      flexDirection: "column"
    },

    content: {
      padding: "60px 0",
      marginTop: "auto",
      marginBottom: "auto",
      [theme.breakpoints!.up!(769)]: {
        minHeight: "320px"
      }
    },

    image: {
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      width: "100%",
      height: "500px",
      overflow: "hidden",

      "&::after": {
        content: "''",
        display: "block",
        paddingTop: "100%"
      },

      [theme.breakpoints!.up!(769)]: {
        position: "absolute !important",
        top: 0,
        left: "50%",
        width: "50vw",
        height: "100%",
        maxHeight: "none",

        "&::after": {
          paddingTop: 0
        }
      }
    },
    text: {
      width: "100%",
      maxWidth: "566px",
      fontSize: "1.22rem",
      [theme.breakpoints!.up!(769)]: {
        width: "100%"
      }
    },
    cta: {
      marginTop: "24px"
    },
    contained: {
      "& $content": {
        padding: "60px 30px",
        [theme.breakpoints!.up!(769)]: {
          width: "auto"
        },
        [theme.breakpoints!.up!("lg")]: {
          paddingRight: "60px",
          paddingLeft: "60px"
        }
      },
      "& $text": {
        fontSize: "1rem"
      },
      "& $image": {
        [theme.breakpoints!.up!(769)]: {
          position: "relative !important",
          width: "100%",
          height: "100%",
          left: 0
        }
      },
      "& $media": {
        [theme.breakpoints!.up!(769)]: {
          position: "absolute"
        }
      }
    },
    fullSize: {
      "& $content": {
        [theme.breakpoints!.up!(769)]: {
          width: "50%",
          paddingRight: "60px",
          marginTop: "auto",
          marginBottom: "auto"
        }
      },
      "&$reversed": {
        "& $content": {
          [theme.breakpoints!.up!(769)]: {
            marginLeft: "50%",
            paddingRight: 0,
            paddingLeft: "60px"
          }
        },
        "& $image": {
          [theme.breakpoints!.up!(769)]: {
            left: "auto",
            right: "50%"
          }
        }
      }
    },
    media: {}
  }),
  {
    name: "Villain"
  }
);

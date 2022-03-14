import { makeStyles } from "@material-ui/styles";
import { ThemeOptions } from "../theme-provider";

export const useStyles = makeStyles(
  (theme: ThemeOptions) => ({
    root: {
      // NOTE: Handle PromoSection series
      "& + &": {
        paddingTop: 0,
        "& $title": {
          display: "none"
        },
        // NOTE: I'm sorry.
        "& $subtitle": {
          display: "block"
        }
      },
      "&:nth-of-type(even), &$reversed": {
        "& $grid": {
          flexDirection: "row-reverse"
        },
        [theme.breakpoints!.up!("lg")]: {
          "& $content": {
            paddingRight: 0,
            paddingLeft: "60px"
          }
        }
      },
      // NOTE: This unfortunately is inhibited by the TableOfContents wrapper in head
      "&:nth-of-type(even)": {
        backgroundColor: theme.colours.alabaster
      }
    },
    title: {
      marginBottom: "32px"
    },
    subtitle: {
      display: "none",
      marginBottom: "24px"
    },
    content: {
      paddingBottom: "24px",
      fontSize: "1rem",
      [theme.breakpoints!.up!("lg")]: {
        paddingRight: "60px",
        paddingBottom: 0
      }
    },
    image: {
      height: "300px",
      backgroundSize: "cover",
      backgroundPosition: "center center",
      backgroundRepeat: "no-repeat",
      [theme.breakpoints!.up!("lg")]: {
        height: "430px"
      }
    },
    reversed: {},
    grid: {}
  }),
  { name: "PromoSection" }
);

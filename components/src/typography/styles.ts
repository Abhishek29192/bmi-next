import { makeStyles } from "@material-ui/styles";
import { ThemeOptions } from "../theme-provider";

export const useStyles = makeStyles(
  (theme: ThemeOptions) => ({
    root: {
      "&$body3": {
        fontSize: "0.667rem"
      }
    },
    body3: {},
    underline: {
      "&::after": {
        backgroundColor: theme.colours.accent,
        content: "''",
        display: "block",
        height: "4px",
        marginTop: "1rem",
        width: "100px"
      },
      "& $darkBg": {
        "&::after": {
          backgroundColor: theme.colours.accent300
        }
      }
    },
    darkBg: {},
    h1NoClamp: {
      fontSize: "3rem"
    },
    h2NoClamp: {
      fontSize: "2.5rem"
    },
    h3NoClamp: {
      fontSize: "2rem"
    },
    h4NoClamp: {
      fontSize: "1.25rem"
    },
    "@global": {
      [theme.breakpoints!.up!(1024)]: {
        html: {
          fontSize: "1.125rem"
        }
      },
      ".MuiTypography-h3::after": {
        marginTop: "0.75rem"
      },
      ".MuiTypography-h4::after": {
        marginTop: "0.5rem"
      },
      ".MuiTypography-button": {
        textTransform: "none"
      }
    }
  }),
  {
    name: "Typography"
  }
);

import { ThemeOptions } from "@bmi-digital/components";
import { makeStyles } from "@material-ui/styles";

export const useStyles = makeStyles(
  (theme: ThemeOptions) => ({
    root: {
      "& + &": {
        marginTop: "16px"
      },
      "& $summary": {
        paddingLeft: "32px",
        paddingRight: "42px",
        color: theme.colours.slate,
        opacity: 1,
        "&:hover": {
          color: theme.colours.charcoal,
          "& $title": {
            "& > $selectedTitle": {
              color: theme.colours.focus
            }
          }
        }
      }
    },
    panel: {
      backgroundColor: theme.colours.alabaster
    },
    selectedTitle: {},
    "@global": {
      "[class*=MuiAccordionSummary-content]": {
        marginTop: "32px",
        marginBottom: "32px"
      },
      "[class*=MuiAccordionSummary-expandIcon]": {
        fontSize: "1.33rem"
      },
      "[class*=MuiAccordionSummary-root].Mui-disabled": {
        opacity: 1,
        "&[class*=MuiAccordionSummary-expandIcon]": {
          display: "none"
        }
      },
      "[class*=MuiAccordionDetails-root]": {
        flexFlow: "column"
      }
    },
    title: {
      "& > $selectedTitle": {
        color: theme.colours.inter,
        [theme.breakpoints!.up!("sm")]: {
          fontSize: "1.6875rem"
        }
      }
    },
    summary: {},
    details: {
      padding: "0 32px 32px",
      flexFlow: "column"
    },

    content: {
      marginBottom: "20px"
    }
  }),
  { name: "ConfiguratorPanel" }
);

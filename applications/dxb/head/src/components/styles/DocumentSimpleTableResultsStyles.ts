import { ThemeOptions } from "@bmi/components";
import { alpha } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

export const useStyles = makeStyles(
  (theme: ThemeOptions) => ({
    root: {},
    tableHeader: {
      width: "92px",
      whiteSpace: "nowrap"
    },
    tableCell: {
      verticalAlign: "middle",
      whiteSpace: "nowrap"
    },
    checked: {},
    "@global": {
      "[class*=MuiFormControlLabel-root]": {
        marginRight: 0
      },
      "& $row": {
        "&$checked": {
          "& [class*=Mui-selected]": {
            // Hack for position relative for tr
            // See https://github.com/w3c/csswg-drafts/issues/1899
            transform: "scale(1)",
            // Replace with `alpha` when converting to material ui
            backgroundColor: `${alpha(theme.colours.accent, 0.1)}`,
            border: `1.2px solid ${theme.colours.accent}`
          }
        }
      }
    },
    row: {
      "&$checked": {
        "&:first-of-type": {
          boxShadow: `inset 0px 0px 0px ${theme.colours.accent}`
        }
      }
    },
    downloadIcon: {
      width: "32px",
      height: "32px"
    },
    externalLinkIcon: {
      fill: theme.colours.inter,
      width: "24px",
      height: "24px"
    },
    noDocumentIcon: {
      width: "16px",
      height: "16px",
      color: theme.colours.charcoal,
      opacity: 0.24
    },
    "abbr[title]::after": {
      content: "''",
      [theme.breakpoints!.up!("lg")]: {
        content: "''"
      }
    }
  }),
  { name: "DocumentSimpleTableResults" }
);

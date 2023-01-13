import { alpha } from "@mui/material";
import { styled } from "@mui/material/styles";

const PREFIX = "documentSimpleTableResultsStyles";
export const classes = {
  tableHeader: `${PREFIX}-tableHeader`,
  tableCell: `${PREFIX}-tableCell`,
  checked: `${PREFIX}-checked`,
  row: `${PREFIX}-row`,
  downloadIcon: `${PREFIX}-downloadIcon`,
  externalLinkIcon: `${PREFIX}-externalLinkIcon`,
  noDocumentIcon: `${PREFIX}-noDocumentIcon`
};

export const StyledSimpleTableResults = styled("div")(({ theme }) => ({
  [`&.${classes.tableHeader}`]: {
    width: "92px",
    whiteSpace: "nowrap"
  },
  [`&.${classes.tableCell}`]: {
    verticalAlign: "middle",
    whiteSpace: "nowrap"
  },
  [`&.${classes.checked}`]: {},
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
  [`&.${classes.row}`]: {
    "&$checked": {
      "&:first-of-type": {
        boxShadow: `inset 0px 0px 0px ${theme.colours.accent}`
      }
    }
  },
  [`&.${classes.downloadIcon}`]: {
    width: "32px",
    height: "32px"
  },
  [`&.${classes.externalLinkIcon}`]: {
    fill: theme.colours.inter,
    width: "24px",
    height: "24px"
  },
  [`&.${classes.noDocumentIcon}`]: {
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
}));

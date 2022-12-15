import { styled } from "@mui/material/styles";

const PREFIX = "configuratorPanelStyles";
export const classes = {
  root: `${PREFIX}-root`,
  panel: `${PREFIX}-panel`,
  selectedTitle: `${PREFIX}-selectedTitle`,
  "@global": "@global",
  title: `${PREFIX}-title`,
  summary: `${PREFIX}-summary`,
  details: `${PREFIX}-details`,
  content: `${PREFIX}-content`
};

export const Root = styled("div")(({ theme }) => ({
  [`&.${classes.root}`]: {
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
  [`&.${classes.panel}`]: {
    backgroundColor: theme.colours.alabaster
  },
  [`&.${classes.selectedTitle}`]: {},
  [`&.${classes["@global"]}`]: {
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
  [`&.${classes.title}`]: {
    "& > $selectedTitle": {
      color: theme.colours.inter,
      [theme.breakpoints!.up!("sm")]: {
        fontSize: "1.6875rem"
      }
    }
  },
  [`&.${classes.summary}`]: {},
  [`&.${classes.details}`]: {
    padding: "0 32px 32px",
    flexFlow: "column"
  },
  [`&.${classes.content}`]: {
    marginBottom: "20px"
  }
}));

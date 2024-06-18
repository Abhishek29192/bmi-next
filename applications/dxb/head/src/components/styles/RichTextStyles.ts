import { styled } from "@mui/material/styles";
import { classes as embeddedLinkClasses } from "./EmbeddedLink.styles";

const PREFIX = "RichText";
export const classes = {
  root: `${PREFIX}-root`,
  title: `${PREFIX}-title`,
  noBottomMargin: `${PREFIX}-no-bottom-margin`
};

export const StyledRichText = styled("div")(({ theme }) => ({
  [`&.${classes.root}`]: {
    "& img.embedded-asset": {
      maxWidth: "100%"
    },

    "& img.embedded-asset + img.embedded-asset": {
      marginLeft: "8px"
    },

    [`& .${embeddedLinkClasses.embeddedLink}`]: {
      display: "block",
      width: "max-content",
      maxWidth: "100%"
    },

    "& p": {
      marginBottom: "0.75em",
      minHeight: "1.4rem",
      "&:last-child:empty": {
        display: "none"
      }
    },

    "& ul": {
      listStyle: "none",
      paddingLeft: "1.5rem"
    },

    "& ul li": {
      display: "flex",
      "&:last-child>p": {
        marginBottom: 0
      }
    },

    "& ul li:before": {
      content: "'◼︎'",
      color: theme.colours.accent,
      marginLeft: "-1.5rem",
      marginTop: "1px",
      paddingRight: "1rem"
    },

    "& ol": {
      listStyle: "decimal",
      paddingLeft: "1.5rem",
      paddingInlineStart: "20px",
      "& li:last-child>p": {
        marginBottom: 0
      }
    },
    "& li > ol": {
      listStyle: "lower-alpha",
      paddingLeft: "1.5rem"
    },

    "& ol li::before": {
      marginLeft: "-1.5rem",
      width: "1.5rem"
    },

    "& ol li p": {
      marginLeft: "10px"
    }
  },
  [`& .${classes.title}`]: {
    marginBottom: "24px"
  },
  [`&.${classes.noBottomMargin}`]: {
    "&&>*:last-child": { marginBottom: 0 }
  }
}));

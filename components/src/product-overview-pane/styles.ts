import { alpha } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { colours, ThemeOptions } from "../theme-provider";

const unavailableItem = (borderRadius: number) => ({
  opacity: 0.5,
  position: "relative",
  color: colours.slate,
  pointerEvents: "auto",
  cursor: "pointer",
  backgroundColor: colours.white,
  backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' #{rx='#{${borderRadius}}' ry='#{${borderRadius}}'} stroke='%23000000FF' stroke-width='1' stroke-dasharray='5%2c 5' stroke-dashoffset='0' stroke-linecap='butt'/%3e%3c/svg%3e")`,
  "&:hover": {
    borderColor: alpha(colours.white, 0.9),
    opacity: 1
  }
});

export const useStyles = makeStyles(
  (theme: ThemeOptions) => ({
    root: {
      padding: "42px 20px",
      background: theme.colours.white,
      border: `1px solid ${theme.colours.alabaster}`,
      fontSize: "1rem"
    },
    brandLogo: {
      fill: theme.colours.white,
      height: "50px",
      marginBottom: "20px"
    },
    heading: {
      marginBottom: "32px"
    },
    attributes: {
      margin: 0,
      padding: 0,
      listStyleType: "none",
      "& li": {
        marginTop: "18px",
        "&:first-child": {
          marginTop: 0
        }
      }
    },
    variants: {
      display: "block",
      margin: "-2px",
      marginTop: "10px",
      paddingLeft: "5px",
      "& $spaced": {
        margin: "-10px",
        marginTop: "2px",
        "& $variant": {
          margin: 0
        }
      }
    },
    variant: {
      display: "inline-block",
      margin: "2px"
    },
    term: {
      display: "inline-block",
      "&::after": {
        content: "':'",
        display: "inline-block",
        marginRight: "4px"
      }
    },
    definition: {
      fontFamily: "Effra Medium"
    },
    printButton: {
      display: "block",
      width: "100%",
      marginTop: "24px"
    },
    unavailable: {
      "& $thumbnail": {
        ...unavailableItem(0),
        "&:hover": {
          backgroundImage: "none"
        }
      },
      "& $chip": {
        "@global": {
          ".MuiChip-root": {
            ...unavailableItem(21)
          }
        }
      }
    },
    chip: {},
    thumbnail: {},
    spaced: {}
  }),
  { name: "ProductOverviewPane" }
);

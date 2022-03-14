import { makeStyles } from "@material-ui/styles";
import { ThemeOptions } from "../theme-provider";

export const useStyles = makeStyles(
  (theme: ThemeOptions) => ({
    root: {
      "& .MuiAccordionSummary-root.Mui-expanded": {
        minHeight: "48px"
      },
      "& .MuiAccordion-root.Mui-expanded": {
        margin: "0px",
        minHeight: "48px"
      },
      "& .Mui-expanded": {
        margin: "0px"
      }
    },
    item: {
      backgroundColor: theme.colours.pearl,
      border: "1px",
      borderStyle: "solid",
      borderColor: theme.colours.storm,
      "&:nth-child(n+2)": {
        borderTop: "0px"
      },
      "& + .item": {
        borderTop: "none",
        marginTop: "-1px"
      },
      "&:last-of-type .details": {
        borderBottomLeftRadius: "4px",
        borderBottomRightRadius: "4px"
      }
    },
    details: (prop: { noInnerPadding?: boolean }) => {
      return {
        backgroundColor: theme.colours.white,
        borderTop: "1px",
        borderTopStyle: "solid",
        borderTopColor: theme.colours.storm,
        padding: prop && prop.noInnerPadding ? "0px" : "8px 16px 16px"
      };
    },
    noInnerPadding: {
      "& .MuiAccordionDetails-root": {
        padding: 0
      }
    },
    summaryRoot: {
      minHeight: "48px",
      "& [class*='MuiIconButton-edgeEnd']": {
        marginRight: "-12px"
      },
      "&:nth-child(1)": {
        minHeight: "48px"
      }
    },
    summaryExpanded: {
      minHeight: "revert",
      margin: "0"
    },
    summaryContent: {}
  }),
  { name: "Accordion" }
);

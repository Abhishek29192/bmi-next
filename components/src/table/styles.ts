import { makeStyles } from "@material-ui/styles";
import { ThemeOptions } from "../theme-provider";

export const useStyles = makeStyles(
  (theme: ThemeOptions) => ({
    root: {
      border: `1px solid ${theme.colours.storm}`
    },
    noBorder: {
      border: 0,
      "& tbody": {
        "& tr": {
          "& td": {
            borderBottom: "0px"
          }
        }
      }
    },
    evenColor: {
      borderTop: `1px solid ${theme.colours.storm}`,
      "& tbody": {
        "& tr": {
          "&:nth-child(even)": {
            backgroundColor: theme.colours.pearl
          }
        }
      }
    },
    oddColor: {
      borderTop: "none",
      "& tbody": {
        "& tr": {
          "&:nth-child(odd)": {
            backgroundColor: theme.colours.pearl
          }
        }
      }
    },
    rowNoColor: {
      "& tbody": {
        "& tr": {
          borderTop: `1px solid ${theme.colours.storm}`,
          "&:first-child": {
            borderTop: "none"
          }
        }
      }
    },
    separator: {
      borderBottom: `1px solid ${theme.colours.storm}`
    },
    "@global": {
      "[class*=MuiTableRow-head]": {
        border: `1px solid ${theme.colours.storm}`
      },
      "[class*=MuiTableCell-head]": {
        color: "inherit",
        padding: "16px",
        fontWeight: "bold"
      },
      "[class*=MuiTableCell-body]": {
        padding: "1rem 16px 0.67rem",
        verticalAlign: "top",
        border: 0
      },
      "[class*=MuiTableCell-head], [class*=MuiTableCell-body]": {
        fontSize: "16px",
        [theme.breakpoints!.up!("sm")]: {
          fontSize: "18px"
        }
      }
    },
    smallTable: {
      border: `1px solid ${theme.colours.storm}`,
      fontSize: "16px",
      [theme.breakpoints!.up!("sm")]: {
        fontSize: "18px"
      },
      "& $noBorder": {
        border: 0
      }
    },
    item: {
      wordBreak: "break-all",
      margin: 0,
      padding: "16px",
      listStyle: "none"
    },
    title: {
      fontWeight: "bold"
    },
    description: {
      margin: "0 0 16px 0",
      "&:last-child": {
        margin: 0
      }
    },
    itemevenColor: {
      "& $item": {
        "&:nth-child(even)": {
          backgroundColor: theme.colours.pearl
        }
      }
    },
    itemoddColor: {
      "& $item": {
        "&:nth-child(odd)": {
          backgroundColor: theme.colours.pearl
        }
      }
    }
  }),
  { name: "Table" }
);

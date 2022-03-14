import { makeStyles } from "@material-ui/styles";
import { ThemeOptions } from "../theme-provider";

export const useStyles = makeStyles(
  (theme: ThemeOptions) => ({
    root: {
      "&[class*=MuiPaginationItem-root]": {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "16px",
        width: "42px",
        height: "42px",
        padding: "0px",
        margin: "0 6px 0 0",
        borderRadius: "42px"
      },
      "&[class*=MuiPaginationItem-textPrimary]": {
        color: theme.colours.inter
      },
      "&[class*=MuiPaginationItem-ellipsis], &[class*=iconButtonStyles-text]": {
        fill: theme.colours.inter
      },
      "&[class*=Mui-disabled]": {
        opacity: 0.38
      },
      "&[class*=Mui-selected]": {
        color: theme.colours.white
      }
    },
    first: {
      "&[class*=MuiPaginationItem-root]": {
        backgroundColor: "transparent",
        fill: theme.colours.inter
      }
    },
    last: {
      "&[class*=MuiPaginationItem-root]": {
        backgroundColor: "transparent",
        fill: theme.colours.inter
      }
    }
  }),
  {
    name: "Pagination"
  }
);

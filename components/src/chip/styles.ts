import { alpha } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { ThemeOptions } from "../theme-provider";

export const useStyles = makeStyles(
  (theme: ThemeOptions) => ({
    root: {
      margin: "5px",
      borderRadius: "21px",
      cursor: "pointer",
      fontSize: "16px",
      "&[class*=Mui-disabled]": {
        backgroundColor: alpha(theme.colours.pearl, 0.5),
        color: alpha(theme.colours.inter, 0.3)
      },
      "&[class*=MuiChip-colorPrimary]": {
        color: theme.colours.white,
        backgroundColor: theme.colours.inter
      },
      "& [class*=MuiChip-deleteIcon]": {
        width: "16px",
        color: theme.colours.inter
      },
      "& [class*=MuiChip-label]": {
        paddingLeft: "15px",
        paddingRight: "15px"
      }
    },
    default: {
      color: theme.colours.inter,
      backgroundColor: theme.colours.pearl,
      "&:hover": {
        backgroundColor: theme.colours.alabaster,
        color: theme.colours.focus
      }
    },
    themeWhite: {
      backgroundColor: theme.colours.white,
      "&[class*=Mui-disabled]": {
        backgroundColor: alpha(theme.colours.white, 0.5)
      }
    }
  }),
  { name: "Chip" }
);

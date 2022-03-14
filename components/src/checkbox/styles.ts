import { alpha } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { ThemeOptions } from "../theme-provider";

export const useStyles = makeStyles(
  (theme: ThemeOptions) => ({
    root: {
      "& [class*=MuiCheckbox-colorPrimary]": {
        color: theme.colours.inter,
        "& .Mui-disabled": {
          color: alpha(theme.colours.inter, 0.25)
        }
      },
      "& [class*=MuiFormControlLabel-root]": {
        alignItems: "flex-start"
      },
      "& [class*=MuiFormControlLabel-label]": {
        marginTop: "1px",
        wordBreak: "break-word"
      },
      "& [class*=MuiFormHelperText-root]": {
        margin: "0 0 14px 33px"
      },
      "& [class*=MuiCheckbox-root]": {
        marginTop: "-9px"
      }
    },
    asterisksDecorator: {
      position: "relative",
      "&::before": {
        content: '"*"',
        display: "block",
        position: "absolute",
        top: 0,
        left: "-15px"
      }
    }
  }),
  { name: "Checkbox" }
);

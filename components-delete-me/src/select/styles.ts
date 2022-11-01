import { makeStyles } from "@material-ui/styles";
import { ThemeOptions } from "../theme-provider";

export const useStyles = makeStyles(
  (theme: ThemeOptions) => ({
    root: {
      ".MuiFilledInput-root": {
        backgroundColor: theme.colours.white,
        borderRadius: "4px",
        border: `1px solid ${theme.colours.storm}`,
        "&:hover": {
          borderColor: theme.colours.slate
        },
        "&::before": {
          content: "''"
        },
        "&::after": {
          content: "''"
        },
        "& .Mui-focused": {
          borderColor: theme.colours.inter,
          boxShadow: `0 0 0 1px ${theme.colours.inter}`,
          "& .Mui-error": {
            boxShadow: `0 0 0 1px ${theme.colours.error}`
          }
        },
        "& .Mui-error": {
          borderColor: theme.colours.error
        }
      },
      ".Mui-disabled": {
        border: `1px solid ${theme.colours.storm}9c`,
        color: `${theme.colours.slate}9c`,
        ".MuiOutlinedInput-notchedOutline": {
          border: 0
        },
        "&:hover": {
          borderColor: `${theme.colours.storm}9c`,
          color: `${theme.colours.slate}9c`
        }
      }
    }
  }),
  { name: "Select" }
);

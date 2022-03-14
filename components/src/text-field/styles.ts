import { makeStyles } from "@material-ui/styles";
import { ThemeOptions } from "../theme-provider";

export const useStyles = makeStyles(
  (theme: ThemeOptions) => ({
    error: {
      position: "absolute",
      right: "10px"
    },
    root: {
      "& .MuiFilledInput-root": {
        backgroundColor: theme.colours.white,
        borderRadius: "4px",
        border: `1px solid ${theme.colours.storm}`,
        "&:hover": {
          borderColor: theme.colours.slate
        },
        "&::before": {
          content: "none"
        },
        "&::after": {
          content: "none"
        },
        "&.Mui-focused": {
          borderColor: theme.colours.inter,
          boxShadow: `inset 0 0 0 1px ${theme.colours.inter}`,
          "&.Mui-error": {
            boxShadow: `inset 0 0 0 1px ${theme.colours.error}`
          }
        },
        "&.Mui-error": {
          borderColor: theme.colours.error
        }
      },
      "& .MuiFilledInput-input": {
        padding: "26px 13px 9px 14px"
      },
      "& .MuiInputLabel-filled": {
        marginLeft: "2px"
      },
      "& .Mui-error, .Mui-error .MuiOutlinedInput-notchedOutline": {
        borderColor: theme.colours.error
      },
      "& .Mui-disabled": {
        opacity: 0.38,
        "&:hover": {
          borderColor: "inherit"
        }
      },
      "& .MuiFormLabel-root": {
        fontSize: "16px",
        "&:not(.Mui-error):not(.Mui-disabled)": {
          color: theme.colours.slate
        },
        "&.Mui-focused:not(.Mui-error)": {
          color: theme.colours.inter
        }
      },
      "& .MuiInputBase-inputMultiline": {
        lineHeight: 1.4
      },
      "& .MuiFilledInput-inputMultiline": {
        padding: 0
      }
    },
    leftAdornment: {
      "& .MuiInputLabel-root.MuiInputLabel-shrink ~ .MuiInputBase-root > .MuiInputAdornment-filled:not(.MuiInputAdornment-hiddenLabel)":
        {
          marginTop: "16px",
          transition: "all 200ms cubic-bezier(0, 0, 0.2, 1) 0ms"
        },
      "& .MuiInputLabel-root:not(.MuiInputLabel-shrink)": {
        marginLeft: "34px"
      },
      "& .MuiFormLabel-root.MuiInputLabel-root": {
        transition:
          "all 200ms cubic-bezier(0, 0, 0.2, 1) 0ms, transform 200ms cubic-bezier(0, 0, 0.2, 1) 0ms"
      },
      "& .MuiInputBase-root.MuiInputBase-formControl.MuiInputBase-adornedEnd": {
        flexDirection: "row-reverse",
        paddingLeft: "8px",
        "& .MuiInputBase-input": {
          paddingLeft: "10px"
        },
        "& .MuiInputAdornment-root": {
          marginRight: 0
        }
      }
    },
    textFieldError: {
      "& .MuiInputBase-input": {
        paddingRight: "20px"
      }
    }
  }),
  { name: "TextField" }
);

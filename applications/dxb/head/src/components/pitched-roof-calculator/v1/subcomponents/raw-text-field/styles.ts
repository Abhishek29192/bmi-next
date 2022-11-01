import { ThemeOptions } from "@bmi-digital/components";
import { makeStyles } from "@material-ui/styles";

export const useStyles = makeStyles(
  (theme: ThemeOptions) => ({
    root: {},
    Error: {
      position: "absolute",
      right: "10px"
    },

    "@global": {
      "[class*=MuiFilledInput-root]": {
        backgroundColor: "white",
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

        "&[class*=Mui-focused]": {
          borderColor: theme.colours.inter,
          boxShadow: `inset 0 0 0 1px ${theme.colours.inter}`,

          "&[class*=Mui-error]": {
            boxShadow: `inset 0 0 0 1px ${theme.colours.error}`
          }
        },

        "&[class*=Mui-error]": {
          borderColor: theme.colours.error
        }
      },

      "[class*=MuiFilledInput-input]": {
        padding: "26px 13px 9px 14px"
      },

      "[class*=MuiInputLabel-filled]": {
        marginLeft: "2px"
      },

      "[class*=Mui-error],    [class*=Mui-error] [class*=MuiOutlinedInput-notchedOutline]":
        {
          borderColor: theme.colours.error
        },

      "[class*=Mui-disabled]": {
        opacity: 0.38,

        "&:hover": {
          borderColor: "inherit"
        }
      },

      "[class*=MuiFormLabel-root]": {
        fontSize: "16px",

        "&:not(.Mui-error):not(.Mui-disabled)": {
          color: theme.colours.slate
        },

        "&.Mui-focused:not(.Mui-error)": {
          color: theme.colours.inter
        }
      },

      "[class*=MuiInputBase-inputMultiline]": {
        lineHeight: 1.4
      },

      "[class*=MuiFilledInput-inputMultiline]": {
        padding: 0
      },
      "& $leftAdornment": {
        "[class*=MuiInputLabel-root][class*=MuiInputLabel-shrink] ~ [class*=MuiInputBase-root] > [class*=MuiInputAdornment-filled]:not([class*=MuiInputAdornment-hiddenLabel])":
          {
            marginTop: "16px",
            transition: "all 200ms cubic-bezier(0, 0, 0.2, 1) 0ms"
          },
        "[class*=MuiInputLabel-root]:not([class*=MuiInputLabel-shrink])": {
          marginLeft: "34px"
        },
        "[class*=MuiFormLabel-root][class*=MuiInputLabel-root]": {
          transition:
            "all 200ms cubic-bezier(0, 0, 0.2, 1) 0ms, transform 200ms cubic-bezier(0, 0, 0.2, 1) 0ms"
        },
        "[class*=MuiInputBase-root][class*=MuiInputBase-formControl][class*=MuiInputBase-adornedEnd]":
          {
            flexDirection: "row-reverse",
            paddingLeft: "8px",
            "& [class*=MuiInputBase-input]": {
              paddingLeft: "10px"
            },
            "& [class*=MuiInputAdornment-root]": {
              marginRight: 0
            }
          }
      },
      "& $error": {
        "[class*=MuiInputBase-input]": {
          paddingRight: "20px"
        }
      }
    },
    error: {},
    leftAdornment: {}
  }),
  { name: "RawTextField" }
);

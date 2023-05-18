import { styled } from "@mui/material/styles";

const PREFIX = "upDownSimpleNumericInputStyles";
export const classes = {
  root: `${PREFIX}-root`,
  "@global": "@global"
};

export const StyledComponentWithButtons = styled("div")(({ theme }) => ({
  [`&.${classes.root}`]: {
    display: "flex",
    flexDirection: "column"
  },

  [`&.${classes["@global"]}`]: {
    ".locked-xs": {
      flexDirection: "row",

      "& .input": {
        margin: 0,
        display: "flex",
        flex: 1,

        "[class*=MuiOutlinedInput-notchedOutline], [class*=MuiFilledInput-root], [class*=MuiFilledInput-input]":
          {
            borderTopRightRadius: "0px",
            borderBottomRightRadius: "0px",
            borderRight: "none",
            height: "48px",
            paddingBottom: "13px",
            textAlign: "center"
          },

        "&.in-middle": {
          "[class*=MuiOutlinedInput-notchedOutline], [class*=MuiFilledInput-root], [class*=MuiFilledInput-input]":
            {
              borderTopLeftRadius: "0px",
              borderBottomLeftRadius: "0px",
              borderLeft: "none"
            }
        },

        "& .button": {
          borderTopLeftRadius: "0px",
          borderBottomLeftRadius: "0px",
          height: "auto",

          "[class*=MuiIconButton-root": {
            width: "56px"
          }
        },

        "& .button-sides": {
          borderTopRightRadius: "0px",
          borderBottomRightRadius: "0px",
          height: "auto",

          "[class*=MuiIconButton-root]": {
            width: "56px"
          }
        },

        "& .button-right": {
          borderTopRightRadius: "0px",
          borderBottomRightRadius: "0px",
          borderTopLeftRadius: "0px",
          borderBottomLeftRadius: "0px",
          borderRightColor: theme.colours.focus,
          borderRightStyle: "solid",
          borderRightWidth: "1px",
          height: "auto",

          "[class*=MuiIconButton-root]": {
            width: "56px"
          }
        }
      }
    },

    [theme.breakpoints!.up!("sm")]: {
      "& .locked-sm": {
        flexDirection: "row",

        "& .input": {
          margin: 0,
          display: "flex",
          flex: 1,

          "[class*=MuiOutlinedInput-notchedOutline], [class*=MuiFilledInput-root], [class*=MuiFilledInput-input]":
            {
              borderTopRightRadius: "0px",
              borderBottomRightRadius: "0px",
              borderRight: "none",
              height: "48px",
              paddingBottom: "13px",
              textAlign: "center"
            },

          "&.in-middle": {
            "[class*=MuiOutlinedInput-notchedOutline], [class*=MuiFilledInput-root], [class*=MuiFilledInput-input]":
              {
                borderTopLeftRadius: "0px",
                borderBottomLeftRadius: "0px",
                borderLeft: "none"
              }
          },

          "& .button": {
            borderTopLeftRadius: "0px",
            borderBottomLeftRadius: "0px",
            height: "auto",

            "[class*=MuiIconButton-root]": {
              width: "56px"
            }
          },

          "& .button-sides": {
            borderTopRightRadius: "0px",
            borderBottomRightRadius: "0px",
            height: "auto",

            "[class*=MuiIconButton-root]": {
              width: "56px"
            }
          },

          "& .button-right": {
            borderTopRightRadius: "0px",
            borderBottomRightRadius: "0px",
            borderTopLeftRadius: "0px",
            borderBottomLeftRadius: "0px",
            borderRightColor: theme.colours.focus,
            borderRightStyle: "solid",
            borderRightWidth: "1px",
            height: "auto",

            "[class*=MuiIconButton-root]": {
              width: "56px"
            }
          }
        }
      }
    },

    [theme.breakpoints!.up!("md")]: {
      "& .locked-md": {
        flexDirection: "row",

        "& .input": {
          margin: 0,
          display: "flex",
          flex: 1,

          "[class*=MuiOutlinedInput-notchedOutline], [class*=MuiFilledInput-root], [class*=MuiFilledInput-input]":
            {
              borderTopRightRadius: "0px",
              borderBottomRightRadius: "0px",
              borderRight: "none",
              height: "48px",
              paddingBottom: "13px",
              textAlign: "center"
            },

          "&.in-middle": {
            "[class*=MuiOutlinedInput-notchedOutline], [class*=MuiFilledInput-root], [class*=MuiFilledInput-input]":
              {
                borderTopLeftRadius: "0px",
                borderBottomLeftRadius: "0px",
                borderLeft: "none"
              }
          },

          "& .button": {
            borderTopLeftRadius: "0px",
            borderBottomLeftRadius: "0px",
            height: "auto",

            "[class*=MuiIconButton-root]": {
              width: "56px"
            }
          },

          "& .button-sides": {
            borderTopRightRadius: "0px",
            borderBottomRightRadius: "0px",
            height: "auto",

            "[class*=MuiIconButton-root]": {
              width: "56px"
            }
          },

          "& .button-right": {
            borderTopRightRadius: "0px",
            borderBottomRightRadius: "0px",
            borderTopLeftRadius: "0px",
            borderBottomLeftRadius: "0px",
            borderRightColor: theme.colours.focus,
            borderRightStyle: "solid",
            borderRightWidth: "1px",
            height: "auto",

            "[class*=MuiIconButton-root]": {
              width: "56px"
            }
          }
        }
      }
    },

    [theme.breakpoints!.up!("lg")]: {
      "& .locked-lg": {
        flexDirection: "row",

        "& .input": {
          margin: 0,
          display: "flex",
          flex: 1,

          "[class*=MuiOutlinedInput-notchedOutline], [class*=MuiFilledInput-root], [class*=MuiFilledInput-input]":
            {
              borderTopRightRadius: "0px",
              borderBottomRightRadius: "0px",
              borderRight: "none",
              height: "48px",
              paddingBottom: "13px",
              textAlign: "center"
            },

          "&.in-middle": {
            "[class*=MuiOutlinedInput-notchedOutline], [class*=MuiFilledInput-root], [class*=MuiFilledInput-input]":
              {
                borderTopLeftRadius: "0px",
                borderBottomLeftRadius: "0px",
                borderLeft: "none"
              }
          },

          "& .button": {
            borderTopLeftRadius: "0px",
            borderBottomLeftRadius: "0px",
            height: "auto",

            "[class*=MuiIconButton-root]": {
              width: "56px"
            }
          },

          "& .button-sides": {
            borderTopRightRadius: "0px",
            borderBottomRightRadius: "0px",
            height: "auto",

            "[class*=MuiIconButton-root]": {
              width: "56px"
            }
          },

          "& .button-right": {
            borderTopRightRadius: "0px",
            borderBottomRightRadius: "0px",
            borderTopLeftRadius: "0px",
            borderBottomLeftRadius: "0px",
            borderRightColor: theme.colours.focus,
            borderRightStyle: "solid",
            borderRightWidth: "1px",
            height: "auto",

            "[class*=MuiIconButton-root]": {
              width: "56px"
            }
          }
        }
      }
    },
    "[class*=OutlinedInput-notchedOutline], [class*=FilledInput-root], [class*=FilledInput-input]":
      {
        borderTopRightRadius: "0px",
        borderBottomRightRadius: "0px",
        borderRight: "none",
        height: "48px",
        paddingBottom: "13px",
        textAlign: "center"
      },
    "&.in-middle": {
      "[class*=OutlinedInput-notchedOutline], [class*=FilledInput-root], [class*=FilledInput-input]":
        {
          borderTopLeftRadius: "0px",
          borderBottomLeftRadius: "0px",
          borderLeft: "none"
        }
    },
    "[class*=IconButton-root]": {
      width: "56px"
    }
  }
}));
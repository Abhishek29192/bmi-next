import { ThemeOptions } from "@bmi/components";
import { makeStyles } from "@material-ui/styles";

export const useStyles = makeStyles(
  (theme: ThemeOptions) => ({
    root: {
      display: "flex",
      flexDirection: "column"
    },
    "@global": {
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
      }
    },
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
    "[class*=MuiIconButton-root]": {
      width: "56px"
    }
  }),
  { name: "UpDownSimpleNumericInput" }
);

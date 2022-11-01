import { makeStyles } from "@material-ui/styles";
import { ThemeOptions } from "../theme-provider";

export const useStyles = makeStyles(
  (theme: ThemeOptions) => ({
    root: {
      height: "100%",
      margin: "auto",
      maxWidth: theme.breakpoints!.values!.xl,
      overflowX: "hidden",
      position: "relative",
      [theme.breakpoints!.up!(1030)]: {
        margin: "0 50px",
        top: "1rem"
      },
      [`@media (min-width: ${theme.breakpoints!.values!.xl + 100})`]: {
        margin: "auto"
      },
      "& $navigationList": {
        "& $navigationList": {
          left: "calc(100% + 1px)",
          "& $navigationList $navigationList $navigationList": {
            borderRight: "none"
          }
        },
        "& $footer": {
          zIndex: 0,
          "& $navigationListButton": {
            "& $outline": {
              color: theme.colours.cyan500,
              borderColor: `${theme.colours.cyan500}80`,
              "&:hover": {
                backgroundColor: `${theme.colours.cyan600}0a`
              }
            }
          },
          [theme.breakpoints!.up!(1030)]: {
            left: "400%"
          },
          [theme.breakpoints!.down!(1030)]: {
            display: "none"
          }
        },
        "& > ul": {
          height: "100%",
          listStyle: "none",
          overflowX: "hidden",
          overflowY: "auto",
          [theme.breakpoints!.up!(1030)]: {
            height: "calc(100% - 1rem)"
          }
        }
      },
      "& > $navigationList": {
        // The first .NavigationList only visible on mobile
        left: "0%",
        transition: "left 0.2s ease-out",
        [theme.breakpoints!.up!(1030)]: {
          borderRight: "none",
          width: "25%",
          marginLeft: "-25%"
        }
      },
      "& $navigationListButton": {
        textAlign: "left",
        "& svg": {
          height: "30px",
          margin: "-7px 0"
        },
        "&:hover $chevronLeft, $active .chevronLeft, &:hover $chevronRight, $active $chevronRight":
          {
            transform: "translateX(0px)"
          },
        "& [class*=MuiButton-label]": {
          justifyContent: "space-between",
          alignItems: "normal"
        },
        "& [class*=MuiButton-startIcon], [class*=MuiButton-endIcon]": {
          display: "initial",
          "& [data-name='bg block']": {
            fill: "none"
          },
          "& svg": {
            maxWidth: "100px",
            [theme.breakpoints!.up!("xl")]: {
              maxWidth: "130px"
            }
          }
        }
      }
    },
    offset0: {
      left: "0 !important",
      [theme.breakpoints!.up!(1030)]: {
        left: "initial !important"
      }
    },
    offset1: {
      left: "-100% !important",
      [theme.breakpoints!.up!(1030)]: {
        left: "initial !important"
      }
    },
    offset2: {
      left: "-200% !important",
      [theme.breakpoints!.up!(1030)]: {
        left: "initial !important"
      }
    },
    offset3: {
      left: "-300% !important",
      [theme.breakpoints!.up!(1030)]: {
        left: "initial !important"
      }
    },
    offset4: {
      left: "-400% !important",
      [theme.breakpoints!.up!(1030)]: {
        left: "initial !important"
      }
    },
    navigationList: {
      backgroundColor: theme.colours.white,
      boxSizing: "border-box",
      display: "none",
      height: "100%",
      position: "absolute",
      width: "100%",
      top: 0,
      zIndex: 1,
      [theme.breakpoints!.up!(1030)]: {
        borderRight: `1px solid ${theme.colours.storm}`
      }
    },
    footer: {},
    show: {
      display: "block"
    },
    backNavigation: {
      [theme.breakpoints!.up!(1030)]: {
        display: "none"
      }
    },
    backButton: {
      fontWeight: "bold",
      marginTop: "10px !important",
      padding: "12px 10px 12px 2px !important",
      width: "250px !important",
      "& svg": {
        width: "24px !important"
      },
      "& [class*=MuiButton-label]": {
        justifyContent: "start !important"
      }
    },
    chevronLeft: {
      height: "1.5rem !important",
      transition: "transform 120ms cubic-bezier(0.4, 0, 0.2, 1)",
      transform: "translateX(10px)",
      marginRight: "15px !important"
    },
    chevronRight: {
      height: "1.5rem !important",
      transition: "transform 120ms cubic-bezier(0.4, 0, 0.2, 1)",
      transform: "translateX(-10px)"
    },
    separator: {
      border: "none",
      borderTop: `1px solid ${theme.colours.storm}`,
      margin: "10px"
    },
    mainMenuTitle: {
      borderBottom: `1px solid ${theme.colours.alabaster}`,
      fontWeight: "bold",
      margin: "15px 10px 10px",
      padding: "0 46px 19px 10px",
      width: "50%"
    },
    navigationListType: {
      display: "inline-block",
      margin: "32px 20px 16px",
      "& svg": {
        height: "2rem"
      },
      [theme.breakpoints!.up!(1030)]: {
        margin: "10px 10px 16px"
      }
    },
    image: {
      maxWidth: "100%",
      padding: "0 10px"
    },
    iconWrapper: {
      display: "inline-block",
      width: "100px",
      [theme.breakpoints!.up!("xl")]: {
        width: "130px"
      }
    },
    utilities: {
      backgroundColor: theme.colours.pearl,
      margin: "10px 0 !important",
      padding: "10px 0 !important"
    },
    languageButtonContent: {
      display: "flex",
      justifyContent: "center",
      fontWeight: 500
    },
    languageIcon: {
      marginRight: "10px",
      width: "20px"
    },
    navigationListButton: {
      color: theme.colours.slate,
      fontSize: "1rem",
      lineHeight: 1,
      margin: "0 10px",
      padding: "12px 10px",
      transition: "background-color 120ms cubic-bezier(0.4, 0, 0.2, 1)",
      width: "calc(100% - 20px)",
      fill: "transparent",
      [theme.breakpoints!.up!(1030)]: {
        margin: 0,
        width: "100%"
      },
      "&:hover": {
        color: theme.colours.charcoal
      }
    },
    active: {
      backgroundColor: "rgba(59, 59, 59, 0.04)"
    },
    outline: {}
  }),
  {
    name: "Navigation"
  }
);

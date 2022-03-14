import { makeStyles } from "@material-ui/styles";
import { ThemeOptions } from "../theme-provider";

const transitionTiming = "280ms cubic-bezier(0.4, 0, 0.2, 1)";
export const useStyles = makeStyles(
  (theme: ThemeOptions) => ({
    root: {
      position: "sticky",
      top: 0,
      left: 0,
      width: "100%",
      zIndex: 10,
      "& ul": {
        marginBottom: 0,
        marginTop: 0,
        paddingLeft: 0
      },
      "& .footer": {
        position: "absolute",
        top: "3rem",
        right: 0
      }
    },
    menuIsOpen: {
      // This class is attached to the `body`
      overflow: "hidden",
      "& $navigationBar, $utilitiesBar": {
        paddingRight: "15px"
      }
    },
    headersmall: {
      "& $logo": {
        width: "60px",
        height: "60px"
      },
      "& $searchButton": {
        color: theme.colours.white
      },
      "& $basketButton": {
        color: theme.colours.white
      },
      "& $backdrop": {
        zIndex: 11
      },
      "& $drawer": {
        height: "auto",
        top: "auto",
        zIndex: 11
      },
      "& $languageDrawer": {
        left: 0,
        height: "calc(100vh - 52px)", // Nav height md
        width: "100%",
        position: "absolute",
        zIndex: 13,
        "& $backNavigation": {
          display: "none"
        }
      },
      "& $navDrawer": {
        left: 0,
        height: "calc(100vh - 132px)", // Header height md
        width: "100%",
        position: "absolute"
      },
      "& $searchDrawerContainer": {
        top: "auto",
        zIndex: 11
      },
      "& $searchDrawer": {
        position: "inherit"
      }
    },
    headermedium: {
      "& $navigation $navItem": {
        fontSize: "16px",
        paddingBottom: "32px",
        paddingTop: "31px",
        "& [class*=MuiTab-wrapper]": {
          flexDirection: "row-reverse"
        }
      },
      "& $navDrawer": {
        height: "calc(100vh - 160px)" // Header height lg
      },
      "& $languageDrawer": {
        height: "calc(100vh - 56px)" // Nav height lg
      },
      "& $searchDrawer": {
        position: "inherit",
        right: "20px",
        width: "566px"
      },
      "& $navItemNoChildren": {
        "& [class*=MuiTab-wrapper]": {
          paddingBottom: 0
        }
      }
    },
    headerlarge: {
      "& $logo": {
        width: "80px",
        height: "80px"
      },
      "& $navigation $navItem": {
        fontSize: "18px",
        padding: "30px 8px 30px 14px",
        "& [class*=MuiSvgIcon-root]": {
          marginLeft: "3px",
          height: "24px",
          width: "24px"
        }
      },
      "& $utilitiesButton": {
        fontSize: "1rem"
      }
    },
    utilitiesBar: {
      backgroundColor: theme.colours.pearl,
      display: "none",
      paddingTop: "0.4375rem",
      paddingBottom: "0.4375rem",
      position: "relative",
      textAlign: "right",
      zIndex: 15,
      [theme.breakpoints!.up!("md")]: {
        display: "block"
      },
      "& ul": {
        display: "flex",
        justifyContent: "flex-end"
      },
      "& $navItem": {
        display: "flex",
        alignItems: "center",
        "&:hover .MuiLink-underlineHover": {
          textDecoration: "none"
        },
        "& + $navItem::before": {
          content: '""',
          display: "block",
          backgroundColor: theme.colours.storm,
          height: "24px",
          margin: "0 7px",
          width: "1px"
        }
      },
      "& $utilitiesButton": {
        fontSize: "0.875rem",
        color: theme.colours.charcoal
      }
    },
    navItem: {},
    utilitiesButton: {},
    languageSelectionButton: {
      transition: `border ${transitionTiming}, padding-bottom ${transitionTiming}, margin-bottom ${transitionTiming}`,
      border: "1px solid transparent"
    },
    downArrow: {
      marginLeft: "1rem",
      transition: `transform ${transitionTiming}`
    },
    downArrowUp: {
      transform: "rotate(180deg)"
    },
    languageSelectionButtonActive: {
      border: `1px solid ${theme.colours.storm}`,
      borderBottomColor: theme.colours.pearl,
      borderRadius: "4px 4px 0 0",
      marginBottom: "-0.5rem",
      paddingBottom: "0.875rem"
    },
    languageIcon: {
      marginRight: "10px",
      width: "20px"
    },
    drawer: {
      backgroundColor: theme.colours.white,
      border: `1px solid ${theme.colours.storm}`,
      height: "100vh",
      position: "fixed",
      right: 0,
      top: 0,
      width: "315px",
      zIndex: 13
    },
    languageDrawer: {
      zIndex: 14,
      overflow: "auto",
      backgroundColor: theme.colours.pearl,
      "& $closeButton": {
        backgroundColor: theme.colours.pearl,
        color: theme.colours.charcoal,
        "&:hover": {
          backgroundColor: theme.colours.pearl,
          color: theme.colours.charcoal
        }
      }
    },
    closeButton: {
      backgroundColor: theme.colours.white,
      color: theme.colours.slate,
      position: "absolute",
      right: 0,
      top: 0,
      zIndex: 2,
      "&:hover": {
        backgroundColor: theme.colours.pearl,
        color: theme.colours.charcoal
      }
    },
    backNavigation: {
      display: "block"
    },
    backButton: {
      fontWeight: "bold",
      marginTop: "10px",
      padding: "12px 10px 12px 2px",
      width: "230px",
      svg: {
        width: "24px"
      },
      "& .MuiButton-label": {
        justifyContent: "start"
      }
    },
    chevronLeft: {
      height: "1.5rem",
      transition: "transform 120ms cubic-bezier(0.4, 0, 0.2, 1)",
      transform: "translateX(10px)",
      marginRight: "15px"
    },
    separator: {
      border: "none",
      borderTop: `1px solid ${theme.colours.storm}`,
      margin: "10px"
    },
    languageContainer: {
      padding: "28px 0px",
      [theme.breakpoints!.up!("lg")]: {
        padding: "32px 0px"
      }
    },
    navigationBar: {
      backgroundColor: theme.colours.white,
      position: "relative",
      zIndex: 12,
      "& .MuiContainer-root": {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }
    },
    navigationBarContent: {
      display: "flex",
      alignItems: "flex-end",
      marginBottom: "-1px",
      width: "100%"
    },
    logoLink: {
      display: "inherit"
    },
    logo: {
      margin: "10px 10px 10px 0",
      width: "50px",
      height: "50px"
    },
    navigation: {
      display: "none",
      [theme.breakpoints!.up!("md")]: {
        display: "block",
        overflowX: "auto"
      },
      "& $navItem": {
        backgroundClip: "padding-box",
        border: "1px solid transparent",
        borderRadius: "3px 3px 0 0",
        minWidth: "auto",
        padding: "6px 12px",
        transition: `color ${transitionTiming}, background-color ${transitionTiming}, box-shadow ${transitionTiming}, border ${transitionTiming}`,
        textDecoration: "none",
        color: theme.colours.slate,
        fontSize: "16px",
        opacity: 1,
        "&:hover": {
          backgroundColor: theme.colours.pearl,
          color: theme.colours.charcoal
        },
        "&.Mui-selected": {
          border: `1px solid ${theme.colours.storm}`,
          borderBottomColor: theme.colours.white
        },
        "& [class*=MuiTab-wrapper]": {
          flexDirection: "column-reverse"
        },
        "& [class*=MuiSvgIcon-root]": {
          marginBottom: 0,
          height: "16px",
          width: "16px"
        }
      },
      "& [class*=MuiTabs-indicator]": {
        display: "none"
      }
    },
    navItemNoChildren: {
      display: "flex",
      alignItems: "center",
      "& [class*=MuiTab-wrapper]": {
        paddingBottom: "16px"
      }
    },
    navItemSelected: {
      borderBottom: `5px solid ${theme.colours.inter} !important`
    },
    navigationBarButtons: {
      display: "flex",
      alignSelf: "stretch",
      alignItems: "center",
      marginLeft: "auto",
      paddingLeft: "10px"
    },
    basketButton: {
      color: theme.colours.inter,
      marginRight: "10px"
    },
    searchButton: {
      color: theme.colours.inter,
      // This breakpoint is not custom to this component
      [theme.breakpoints!.up!("lg")]: {
        "& $searchButtonIsOnSearchPage": {
          display: "none"
        }
      }
    },
    searchButtonIsOnSearchPage: {},
    burgerButton: {
      color: theme.colours.inter,
      marginLeft: "10px",
      [theme.breakpoints!.up!("md")]: {
        display: "none"
      }
    },
    backdrop: {
      zIndex: 12
    },
    navDrawer: {
      overflow: "hidden"
    },
    searchDrawerContainer: {
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      margin: "auto",
      maxWidth: theme.breakpoints!.values!.xl,
      zIndex: 12
    },
    searchDrawerContainerHidden: {
      display: "none"
    },
    searchDrawer: {
      padding: "30px",
      "& [class*=MuiTypography-root]": {
        marginBottom: "32px"
      }
    },
    cartDrawerContainer: {
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      margin: "auto",
      maxWidth: theme.breakpoints!.values!.xl,
      zIndex: 12,
      [theme.breakpoints!.up!("md")]: {
        top: "auto",
        zIndex: 11
      }
    },
    cartDrawerContainerHidden: {
      display: "none"
    },
    staticLogo: {
      margin: "10px 10px 10px 0",
      width: "50px",
      height: "50px"
    }
  }),
  { name: "Header" }
);

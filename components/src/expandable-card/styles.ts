import { makeStyles } from "@material-ui/styles";
import { ThemeOptions } from "../theme-provider";

export const useExpandableCardStyles = makeStyles(
  (theme: ThemeOptions) => ({
    root: {
      zIndex: 1,
      minHeight: "56px",
      transition:
        "top 0.2s ease-out, right 0.2s ease-out, bottom 0.2s ease-out, left 0.2s ease-out, height 0.2s ease-out, box-shadow 0.2s ease-out",
      "&:focus": {
        outline: `${theme.colours.inter} 2px`
      },
      [theme.breakpoints!.up!("sm")]: {
        minHeight: "100%"
      },
      [theme.breakpoints!.down!("sm")]: {
        "&:hover .MuiPaper-root": {
          background: "transparent",
          boxShadow: "none"
        }
      }
    },
    collapsed: {
      cursor: "pointer",
      "&:hover": {
        "& $title": {
          color: theme.colours.charcoal
        },
        "& $icon": {
          color: theme.colours.inter
        }
      },
      [theme.breakpoints!.up!("sm")]: {
        "&:hover": {
          boxShadow:
            "0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12)"
        }
      }
    },
    expanded: {
      zIndex: 2,
      position: "absolute",
      minHeight: "auto",
      top: 0,
      right: 0,
      left: 0,
      background: theme.colours.white,
      boxShadow:
        "0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12)",
      "&:hover": {
        background: theme.colours.white,
        boxShadow:
          "0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12)"
      },
      transition:
        "right 0.25s ease-in-out, left 0.25s ease-in-out, box-shadow 0.25s ease-in-out, height 0.25s ease-in-out, top 0.25s 0.2s ease-out, bottom 0.25s 0.2s ease-out",
      "& $content": {
        padding: "20px"
      },
      "& $icon": {
        left: 0,
        width: "36px",
        height: "36px"
      },
      "& $title": {
        marginTop: 0,
        top: "6px",
        left: "calc(16px + 36px)",
        right: "100%",
        transform: "translateX(0)"
      },
      "& $close": {
        display: "block",
        animation: "$fade 0.25s 0.2s ease-out both"
      },
      "& $footer": {
        display: "block",
        animation: "$fade 0.25s 0.2s ease-out both"
      },
      "& $body": {
        display: "block",
        animation: "$fade 0.25s 0.2s ease-out both"
      }
    },
    header: {
      display: "flex",
      alignItems: "center",
      minHeight: "36px",
      position: "relative",
      paddingRight: "calc(48px / 2 + 6px)",
      [theme.breakpoints!.up!("sm")]: {
        justifyContent: "center",
        paddingRight: 0
      }
    },
    icon: {
      width: "24px",
      height: "24px",
      marginRight: "16px",
      color: theme.colours.accent,
      transition:
        "color 280ms cubic-bezier(0.4, 0, 0.2, 1), height 0.2s ease-in-out, width 0.2s ease-in-out, top 0.2s ease-in-out, left 0.2s ease-in-out",

      [theme.breakpoints!.up!("sm")]: {
        position: "absolute",
        width: "72px",
        height: "72px",
        top: 0,
        left: "calc(50% - 72px / 2)"
      }
    },
    title: {
      textTransform: "none",
      color: theme.colours.slate,
      transition:
        "color 280ms cubic-bezier(0.4, 0, 0.2, 1), top 0.2s ease-in-out, right 0.2s ease-in-out, left 0.2s ease-in-out",
      [theme.breakpoints!.up!("sm")]: {
        position: "absolute",
        top: "calc(72px + 24px)",
        left: 0,
        whiteSpace: "nowrap",
        textAlign: "center",
        right: 0
      }
    },
    titleStatic: {
      [theme.breakpoints!.up!("sm")]: {
        position: "static",
        marginTop: "calc(72px + 24px)",
        whiteSpace: "inherit"
      }
    },
    close: {
      position: "absolute",
      top: "6px",
      right: "6px",
      zIndex: 3,
      color: theme.colours.slate,
      opacity: 0,
      display: "none"
    },
    body: {
      marginTop: "19px",
      borderTop: `1px solid ${theme.colours.storm}`,
      paddingTop: "20px",
      opacity: 0,
      display: "none"
    },
    footer: {
      marginTop: "auto",
      borderTop: `1px solid ${theme.colours.storm}`,
      paddingTop: "20px",
      opacity: 0,
      display: "none"
    },
    content: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start",
      minHeight: "100%",
      "&.MuiCardContent-root": {
        paddingBottom: "16px"
      },
      transition: "padding 0.2s ease-in-out"
    },
    "@keyframes fade": {
      "0%": {
        opacity: 0
      },
      "100%": {
        opacity: 1
      }
    }
  }),
  { name: "ExpandableCard" }
);

export const useExpandableCardListStyles = makeStyles(
  (theme: ThemeOptions) => ({
    root: {
      display: "flex",
      position: "relative",
      flexDirection: "column",
      justifyContent: "space-between",
      [theme.breakpoints!.up!("sm")]: {
        margin: "-10px",
        flexWrap: "wrap",
        flexDirection: "row",
        "& $item": {
          flex: "1 0 21%",
          margin: "10px"
        }
      }
    },
    item: {}
  }),
  { name: "ExpandableCardList" }
);

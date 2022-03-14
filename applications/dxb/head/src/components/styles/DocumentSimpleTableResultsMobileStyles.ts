import { ThemeOptions } from "@bmi/components";
import { makeStyles } from "@material-ui/styles";

export const useStyles = makeStyles(
  (theme: ThemeOptions) => ({
    root: {},
    listItem: {
      padding: "20px 0 12px",
      position: "relative",
      minHeight: "126px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",

      "&:nth-child(2n + 1)": {
        "&::before": {
          content: "''",
          display: "block",
          position: "absolute",
          left: "-20px",
          right: "-20px",
          bottom: 0,
          top: 0,
          backgroundColor: theme.colours.perl
        }
      }
    },

    documentTitle: {
      lineHeight: "31px",
      color: theme.colours.slate,
      paddingTop: "5px",
      fontFamily: "Effra Medium",
      display: "-webkit-box",
      "-webkit-line-clamp": 3,
      "-webkit-box-orient": "vertical",
      overflow: "hidden"
    },

    documentType: {
      color: theme.colours.slate,
      lineHeight: "19px"
    },

    listTitleRow: {
      display: "flex",
      position: "relative"
    },

    listDownloadRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      position: "relative"
    },

    externalLinkIcon: {
      fill: theme.colours.inter,
      width: "16px",
      height: "16px",
      margin: "6px 8px"
    },

    listIcon: {
      marginRight: "12px",
      display: "flex"
    }
  }),
  { name: "DocumentSimpleTableResultsMobile" }
);

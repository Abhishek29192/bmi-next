import { ThemeOptions } from "@bmi-digital/components";
import { makeStyles } from "@material-ui/styles";

export const useStyles = makeStyles(
  (theme: ThemeOptions) => ({
    root: {},
    headerRow: {
      verticalAlign: "top",
      color: theme.colours.slate
    },

    bodyRow: {
      verticalAlign: "middle"
    },

    "@global": {
      "[class*=MuiFormControlLabel-root]": {
        marginRight: 0
      },
      "[class*=MuiAccordionDetails-root]": {
        padding: "0px 15px"
      }
    },

    assetTypeCell: {
      textAlign: "center",
      paddingLeft: "6px",
      paddingRight: "6px",
      width: "72px"
    },

    tooltipIcon: {
      color: theme.colours.inter
    },

    formatIcon: {
      width: "32px",
      height: "32px"
    },

    alignCenter: {
      textAlign: "center",
      verticalAlign: "middle"
    },
    infoIconContainer: {},
    iconContainer: {},
    downloadIconContainer: {},
    accordionDetails: {
      padding: "0px 15px",
      minHeight: "56px",
      textAlign: "center",
      verticalAlign: "middle",
      backgroundColor: "white",
      borderBottom: `1px solid ${theme.colours.storm}`,
      "&:last-child": {
        borderBottom: "none"
      },
      "& $iconContainer": {
        width: "37px",
        marginTop: "12px",
        marginRight: "15px"
      },
      "& $infoIconContainer": {
        width: "37px",
        marginTop: "7px",
        marginRight: "15px"
      },
      "& $downloadIconContainer": {
        width: "100%",
        marginTop: "15px",
        display: "flex",
        justifyContent: "flex-end",

        "& $allFilesIcon": {
          color: theme.colours.inter
        }
      }
    },

    noDocumentIcon: {
      width: "16px",
      height: "16px",
      color: theme.colours.charcoal,
      opacity: 0.24
    },

    externalLinkIcon: {
      fill: theme.colours.inter,
      width: "24px",
      height: "24px"
    },
    externalDownloadButton: {
      "&:hover": {
        backgroundColor: "unset"
      }
    },

    allFilesHeader: {
      width: "92px",
      whiteSpace: "nowrap"
    },

    allFilesHeaderWrapper: {
      display: "flex",
      alignItems: "center"
    },

    allFilesIcon: {
      width: "24px",
      height: "24px",
      marginRight: "2px"
    }
  }),
  { name: "DocumentTechnicalTableResults" }
);

import { styled } from "@mui/material/styles";

const PREFIX = "DocumentTechnicalTableResults";
export const classes = {
  headerRow: `${PREFIX}-headerRow`,
  bodyRow: `${PREFIX}-bodyRow`,
  "@global": `@global`,
  assetTypeCell: `${PREFIX}-assetTypeCell`,
  tooltipIcon: `${PREFIX}-tooltipIcon`,
  formatIcon: `${PREFIX}-formatIcon`,
  alignCenter: `${PREFIX}-alignCenter`,
  infoIconContainer: `${PREFIX}-infoIconContainer`,
  iconContainer: `${PREFIX}-iconContainer`,
  downloadIconContainer: `${PREFIX}-downloadIconContainer`,
  accordionDetails: `${PREFIX}-accordionDetails`,
  noDocumentIcon: `${PREFIX}-noDocumentIcon`,
  externalLinkIcon: `${PREFIX}-externalLinkIcon`,
  externalDownloadButton: `${PREFIX}-externalDownloadButton`,
  allFilesHeader: `${PREFIX}-allFilesHeader`,
  allFilesHeaderWrapper: `${PREFIX}-allFilesHeaderWrapper`,
  allFilesIcon: `${PREFIX}-allFilesIcon`
};

export const Root = styled("div")(({ theme }) => ({
  [`.${classes.headerRow}`]: {
    verticalAlign: "top",
    color: theme.colours.slate
  },
  [`.${classes.bodyRow}`]: {
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
  [`.${classes.assetTypeCell}`]: {
    textAlign: "center",
    paddingLeft: "6px",
    paddingRight: "6px",
    width: "72px"
  },
  [`.${classes.tooltipIcon}`]: {
    color: theme.colours.inter
  },
  [`.${classes.formatIcon}`]: {
    width: "32px",
    height: "32px"
  },
  [`.${classes.alignCenter}`]: {
    textAlign: "center",
    verticalAlign: "middle"
  },
  [`.${classes.infoIconContainer}`]: {},
  [`.${classes.iconContainer}`]: {},
  [`.${classes.downloadIconContainer}`]: {},
  [`.${classes.accordionDetails}`]: {
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
  [`.${classes.noDocumentIcon}`]: {
    width: "16px",
    height: "16px",
    color: theme.colours.charcoal,
    opacity: 0.24
  },
  [`.${classes.externalLinkIcon}`]: {
    fill: theme.colours.inter,
    width: "24px",
    height: "24px"
  },
  [`.${classes.externalDownloadButton}`]: {
    "&:hover": {
      backgroundColor: "unset"
    }
  },
  [`.${classes.allFilesHeader}`]: {
    width: "92px",
    whiteSpace: "nowrap"
  },
  [`.${classes.allFilesHeaderWrapper}`]: {
    display: "flex",
    alignItems: "center"
  },
  [`.${classes.allFilesIcon}`]: {
    width: "24px",
    height: "24px",
    marginRight: "2px"
  }
}));

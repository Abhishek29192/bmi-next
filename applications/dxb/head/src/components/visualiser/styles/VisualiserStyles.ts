import { Button, ContainerDialog } from "@bmi-digital/components";
import { iconButtonClasses } from "@mui/material";
import { styled } from "@mui/material/styles";

const PREFIX = "VisualiserV2";

export const classes = {
  root: `${PREFIX}-root`,
  secondary: `${PREFIX}-secondary`,
  groupTitle: `${PREFIX}-groupTitle`,
  shareButton: `${PREFIX}-shareButton`,
  content: `${PREFIX}-content`,
  contentTitle: `${PREFIX}-contentTitle`,
  progressContainer: `${PREFIX}-progressContainer`,
  details: `${PREFIX}-details`,
  detailsActions: `${PREFIX}-detailsActions`,
  detailsLogo: `${PREFIX}-detailsLogo`,
  detailsTitle: `${PREFIX}-detailsTitle`,
  detailsText: `${PREFIX}-detailsText`,
  actions: `${PREFIX}-actions`,
  icon: `${PREFIX}-icon`,
  container: `${PREFIX}-container`,
  viewer: `${PREFIX}-viewer`,
  activeSelectionOption: `${PREFIX}-activeSelectionOption`,
  VisualiserPopover: `${PREFIX}-VisualiserPopover`
};

export const StyledContainerDialog = styled(ContainerDialog)(({ theme }) => ({
  height: "100vh",
  width: "100vw",
  // "& >div:first-child": {
  //   "& button": {
  //     margin: "10px 6px 10px 16px"
  //   },
  //   [theme.breakpoints!.up!("md")]: {
  //     "& $detailsLogo": {
  //       marginBottom: "1rem"
  //     },

  //     "& $detailsTitle": {
  //       marginBottom: "1rem"
  //     }
  //   }
  // },
  // [`&.${classes.secondary}`]: {
  //   boxShadow: "none"
  // },
  [`&.${classes.groupTitle}`]: {
    marginTop: "24px",
    marginBottom: "24px"
  },

  [`&.${classes.content}`]: {
    overflowY: "auto",
    height: "100%",
    backgroundColor: theme.colours.pearl,
    padding: 0
  },
  // [`&.${classes.contentTitle}`]: {
  //   margin: "6px auto 16px 30px",
  //   alignSelf: "center"
  // },
  [`& .${classes.progressContainer}`]: {
    position: "absolute",
    top: "70px",
    bottom: 0,
    left: 0,
    right: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.65)",
    borderRadius: "3px"
  },
  [`& .${classes.details}`]: {
    display: "flex",
    gap: "40px",
    alignItems: "center",
    margin: "18px 10px",
    [theme.breakpoints!.up!("sm")]: {
      flexDirection: "column",
      gap: "12px",
      alignItems: "flex-start",

      "& $detailsActions": {
        marginLeft: "unset"
      }
    }
  },
  [`& .${classes.detailsActions}`]: {
    display: "flex",
    gap: "12px",
    maxWidth: "33.33%",
    [theme.breakpoints!.up!("sm")]: {
      width: "100%"
    },

    "& button": {
      "&:first-child": {
        flex: 1
      }
    }
  },
  [`&.${classes.detailsLogo}`]: {
    marginBottom: "0.5rem",
    [theme.breakpoints!.up!("md")]: {
      marginBottom: "1rem"
    }
  },
  [`&.${classes.detailsTitle}`]: {
    marginBottom: "0.5rem",
    [theme.breakpoints!.up!("md")]: {
      marginBottom: "1rem"
    }
  },
  [`&.${classes.detailsText}`]: {
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap"
  },
  // [`&.${classes.actions}`]: {
  //   width: "100%",
  //   display: "flex",
  //   alignItems: "center",
  //   justifyContent: "center",
  //   backgroundColor: theme.colours.blue800,
  //   minHeight: "5rem",
  //   padding: "0.875rem"
  // },
  [`&.${classes.icon}`]: {
    fill: "rgba(255, 255, 255, 0.8)"
  },
  [`&.${classes.container}`]: {
    [theme.breakpoints!.up!("sm")]: {
      padding: "0px 20px"
    }
  },
  [`& .${classes.viewer}`]: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    minHeight: 0,
    height: "100%"
  },
  [`&.${classes.activeSelectionOption}`]: {
    padding: "0px",
    border: `2px solid ${theme.colours.accent}`
  },
  [`&.${classes.VisualiserPopover}`]: {}
}));

export const StyledSharePopover = styled("div")(({ theme }) => ({}));

export const StyledShareButton = styled(Button)(({ theme }) => ({
  width: "48px",
  height: "48px",
  minWidth: "unset",
  [`&.${iconButtonClasses.root}`]: {
    backgroundColor: theme.colours.white
  },
  [`&.${iconButtonClasses.root}:hover`]: {
    backgroundColor: theme.colours.focus
  }
}));

export const StyledActions = styled("nav")(({ theme }) => ({
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: theme.colours.blue800,
  minHeight: "5rem",
  padding: "0.875rem"
}));

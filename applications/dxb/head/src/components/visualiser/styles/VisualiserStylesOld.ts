import { Button, ContainerDialog } from "@bmi-digital/components";
import { iconButtonClasses } from "@mui/material";
import { styled } from "@mui/material/styles";

const PREFIX = "VisualiserV1";

export const classes = {
  root: `${PREFIX}-root`,

  header: `${PREFIX}-header`,
  secondary: `${PREFIX}-secondary`,
  groupTitle: `${PREFIX}-groupTitle`,
  content: `${PREFIX}-content`,
  progressContainer: `${PREFIX}-progressContainer`,
  details: `${PREFIX}-details`,
  detailsLogo: `${PREFIX}-detailsLogo`,
  detailsTitle: `${PREFIX}-detailsTitle`,
  detailsText: `${PREFIX}-detailsText`,
  // actions: `${PREFIX}-actions`,
  icon: `${PREFIX}-icon`,
  container: `${PREFIX}-container`,
  viewer: `${PREFIX}-viewer`,
  activeSelectionOption: `${PREFIX}-activeSelectionOption`
};

export const StyledContainerDialog = styled(ContainerDialog)(({ theme }) => ({
  height: "100vh",
  width: "100vw",
  [theme.breakpoints!.up!("md")]: {
    "& $detailsLogo": {
      marginBottom: "1rem"
    },

    "& $detailsTitle": {
      marginBottom: "1rem"
    }
  },
  [`& .${classes.secondary}`]: {
    boxShadow: "none"
  },
  [`& .${classes.groupTitle}`]: {
    marginTop: "24px",
    marginBottom: "24px"
  },
  [`& .${classes.header}`]: {
    margin: "16px"
  },
  [`& .${iconButtonClasses.root}`]: {
    margin: "0px"
  },
  [`& .${classes.content}`]: {
    overflowY: "auto",
    height: "100%"
  },
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
    position: "absolute",
    top: "70px",
    left: "30px",
    pointerEvents: "none",
    right: "30px"
  },
  [`& .${classes.detailsLogo}`]: {
    marginBottom: "0.5rem"
  },
  [`& .${classes.detailsTitle}`]: {
    marginBottom: "0.5rem",
    [theme.breakpoints!.up!("md")]: {
      marginBottom: "1rem"
    }
  },
  [`& .${classes.detailsText}`]: {
    marginBottom: "0.5rem"
  },
  [`& .${classes.icon}`]: {
    fill: "rgba(255, 255, 255, 0.8)"
  },
  [`& .${classes.container}`]: {
    [theme.breakpoints!.up!("sm")]: {
      padding: "0px 20px 20px"
    }
  },
  [`& .${classes.viewer}`]: {
    display: "flex",
    height: "100%",
    alignItems: "center",
    justifyContent: "center"
  },
  [`& .${classes.activeSelectionOption}`]: {
    padding: "0px",
    border: `2px solid ${theme.colours.accent}`
  },
  "& $VisualiserPopover": {
    "[class*=MuiPopover-paper]": {
      padding: "0 10px",

      [theme.breakpoints!.down!("sm")]: {
        maxWidth: "100%",
        width: "100%",
        left: "0 !important"
      },

      "&::before": {
        content: "''",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        margin: "0 10px",
        borderTop: `1px solid ${theme.colours.pearl}`
      }
    }
  },
  "& $viewer": {
    "[class*=canvas:focus]": {
      outline: "none"
    }
  },
  "& $actions": {
    [theme.breakpoints!.up!("sm")]: {
      "[class*=MuiButton-root]": {
        display: "flex",
        flexFlow: "column"
      }
    }
  },
  "& $details": {
    "[class*=MuiPaper-root]": {
      pointerEvents: "all",
      backgroundColor: "rgba(255, 255, 255, 0.75)",
      boxShadow: "none"
    }
  }
}));

export const StyledShareButton = styled(Button)(({ theme }) => ({
  width: "48px",
  height: "48px",
  minWidth: "unset"
}));

export const StyledActions = styled("nav")(({ theme }) => ({
  position: "absolute",
  border: 0,
  left: 0,
  bottom: 0,
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: theme.colours.blue800,
  minHeight: "5rem",
  padding: "0.875rem"
}));

export const StyledSharePopover = styled("div")(({ theme }) => ({}));

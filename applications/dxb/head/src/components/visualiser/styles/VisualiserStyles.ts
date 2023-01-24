import { Button, ContainerDialog } from "@bmi-digital/components";
import { iconButtonClasses } from "@mui/material";
import { styled } from "@mui/material/styles";

const PREFIX = "VisualiserV2";

export const classes = {
  root: `${PREFIX}-root`,
  header: `${PREFIX}-header`,
  secondary: `${PREFIX}-secondary`,
  groupTitle: `${PREFIX}-groupTitle`,
  content: `${PREFIX}-content`,
  contentTitle: `${PREFIX}-contentTitle`,
  progressContainer: `${PREFIX}-progressContainer`,
  details: `${PREFIX}-details`,
  detailsContainer: `${PREFIX}-detailsContainer`,
  detailsActions: `${PREFIX}-detailsActions`,
  detailsLogo: `${PREFIX}-detailsLogo`,
  detailsTitle: `${PREFIX}-detailsTitle`,
  detailsText: `${PREFIX}-detailsText`,
  actions: `${PREFIX}-actions`,
  icon: `${PREFIX}-icon`,
  container: `${PREFIX}-container`,
  viewer: `${PREFIX}-viewer`,
  activeSelectionOption: `${PREFIX}-activeSelectionOption`
};

export const StyledContainerDialog = styled(ContainerDialog)(({ theme }) => ({
  height: "100vh",
  width: "100vw",
  [`& .${classes.header}`]: {
    margin: "16px"
  },
  [`& .${iconButtonClasses.root}`]: {
    margin: "0px"
  },
  [`&.${classes.groupTitle}`]: {
    marginTop: "24px",
    marginBottom: "24px"
  },

  [`& .${classes.content}`]: {
    overflowY: "auto",
    height: "100%",
    backgroundColor: theme.colours.pearl,
    padding: 0
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
    display: "flex",
    gap: "40px",
    alignItems: "center",
    margin: "18px 10px",
    zIndex: 99,
    position: "absolute",
    width: "33.33%",
    padding: "12px",
    backgroundColor: "rgba(255, 255, 255, 0.65)",
    [theme.breakpoints!.up!("xs")]: {
      width: "auto"
    },
    [theme.breakpoints!.up!("sm")]: {
      flexDirection: "column",
      gap: "12px",
      alignItems: "flex-start",
      width: "33.33%",
      "& $detailsActions": {
        marginLeft: "unset"
      }
    }
  },
  [`& .${classes.detailsContainer}`]: {
    display: "flex",
    gap: "12px",
    flexDirection: "column",

    "& button": {
      "&:first-child": {
        flex: 1
      }
    }
  },
  [`& .${classes.detailsLogo}`]: {
    marginBottom: "0.5rem",
    [theme.breakpoints!.up!("md")]: {
      marginBottom: "1rem"
    }
  },
  [`& .${classes.detailsTitle}`]: {
    marginBottom: "0.5rem",
    [theme.breakpoints!.up!("md")]: {
      marginBottom: "1rem"
    }
  },
  [`& .${classes.detailsText}`]: {
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap"
  },
  [`& .${classes.container}`]: {
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
  [`& .${classes.activeSelectionOption}`]: {
    padding: "0px",
    border: `2px solid ${theme.colours.accent}`
  }
}));

export const StyledShareButton = styled(Button)(({ theme }) => ({
  width: "48px",
  height: "48px",
  minWidth: "unset"
}));

export const StyledActions = styled("nav")(({ theme }) => ({
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

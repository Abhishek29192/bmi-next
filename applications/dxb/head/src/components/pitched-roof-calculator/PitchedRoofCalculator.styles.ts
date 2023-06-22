import { styled } from "@mui/material/styles";
import { ContainerDialog, Logo } from "@bmi-digital/components";
import { LinearProgress } from "@mui/material";

const PREFIX = "PitchedRoofCalculator";

export const classes = {
  root: `${PREFIX}-root`,
  dialogContent: `${PREFIX}-dialogContent`,
  dialogBody: `${PREFIX}-dialogBody`,
  modalHeader: `${PREFIX}-modalHeader`
};

export const StyledContainerDialog = styled(ContainerDialog)(({ theme }) => ({
  [`.${classes.root}`]: {
    position: "relative",
    height: "100%"
  },
  [`.${classes.dialogContent}`]: {
    padding: "0",
    overflow: "auto"
  },
  [`.${classes.dialogBody}`]: {
    height: "100%"
  },
  [`.${classes.modalHeader}`]: {
    display: "flex",
    padding: "10px 30px",
    justifyContent: "space-between !important",
    alignItems: "center",
    background: "#fcfcfc",
    [theme.breakpoints.down("sm")]: {
      padding: "10px 18px"
    }
  }
}));

export const StyledLogo = styled(Logo)(({ theme }) => ({
  width: "80px",
  height: "80px",

  [theme.breakpoints.down("sm")]: {
    width: "50px",
    height: "50px"
  }
}));

export const StyledLinearProgress = styled(LinearProgress)(({ theme }) => ({
  width: "500px",
  backgroundColor: `rgba(${theme.colours.cyan400}, 0.3)`,

  ["&>div"]: {
    backgroundColor: theme.colours.cyan400
  },

  [theme.breakpoints.down("lg")]: {
    width: "300px"
  },

  [theme.breakpoints.down("sm")]: {
    width: "192px"
  }
}));

export const StyledSpinner = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "calc(100vh - 100px)" /* container margins and paddings */
}));

import Icon from "@bmi-digital/components/icon/Icon";
import { styled } from "@mui/material/styles";
import { tooltipClasses } from "@mui/material/Tooltip";

const PREFIX = "Visualiser";

export const classes = {
  root: `${PREFIX}-root`,
  disabledIcon: `${PREFIX}-disabled-icon`,
  toolTip: `${PREFIX}-tool-top`,
  iconIsSelected: `${PREFIX}-is-selected-icon`
};

export const Canvas = styled("div")({
  height: "100%",
  width: "100%"
});

export const Controls = styled("div")(({ theme }) => ({
  bottom: "24px",
  position: "absolute",
  right: "24px",
  [theme.breakpoints.down("md")]: {
    right: "18px",
    bottom: "18px"
  }
}));

export const ControlsGroup = styled("div")(({ theme }) => ({
  boxShadow:
    "0px 1px 1px rgb(0, 0, 0, 0.14), 0px 2px 1px -1px rgb(0, 0, 0, 0.12), 0px 1px 3px rgb(0, 0, 0, 0.2)",
  borderRadius: "3px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: theme.colours.white,
  [":first-of-type"]: {
    marginBottom: "12px"
  }
}));

export const Root = styled("div")(({ theme }) => ({
  flex: 1,
  minHeight: 0,
  position: "relative",
  width: "100%",
  [`.${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.colours.white,
    boxShadow: "0px 1px 3px rgb(0, 0, 0, 0.2)",
    borderRadius: "3px",
    padding: "12px",
    pointerEvents: "unset",
    [theme.breakpoints.down("sm")]: {
      margin: "0 6px"
    }
  }
}));

export const RotateContainer = styled("div")({
  display: "grid",
  gap: "6px 6px",
  gridTemplateColumns: "1fr 1fr 1fr",
  gridTemplateRows: "1fr 1fr 1fr",
  gridTemplateAreas: `
    ". top . " 
    "left reset right" 
    ". bottom ."`
});

export const StyledIcon = styled(Icon)(({ theme }) => ({
  boxSizing: "content-box",
  cursor: "pointer",
  fill: theme.colours.cyan500,
  height: "16px",
  padding: "16px",
  width: "16px",
  ["&:hover"]: {
    fill: theme.colours.cyan600
  },
  [`.${classes.disabledIcon}`]: {
    fill: "rgb(0, 91, 140, 0.35)",
    pointerEvents: "none"
  }
  // ["& + svg"]: {
  //   borderTop: `1px solid ${theme.colours.alabaster}`,
  //   ["&.large-icon-selected"]: {
  //     paddingTop: "7px"
  //   }
  // }
}));

export const RotateButton = styled(StyledIcon)({
  borderRadius: "3px",
  borderTop: "none",
  boxShadow:
    "0px 1px 1px rgb(0, 0, 0, 0.14), 0px 2px 1px -1px rgb(0, 0, 0, 0.12), 0px 1px 3px rgb(0, 0, 0, 0.2)",
  padding: "12px",
  [`&.${classes.disabledIcon}`]: {
    fill: "rgb(0, 91, 140, 0.35)",
    pointerEvents: "none"
  }
});

export const RotateBottom = styled(RotateButton)({
  gridArea: "bottom"
});

export const RotateLeft = styled(RotateButton)({
  gridArea: "left"
});

export const RotateReset = styled(RotateButton)({
  border: "none",
  gridArea: "reset"
});

export const RotateRight = styled(RotateButton)({
  gridArea: "right"
});

export const RotateTop = styled(RotateButton)({
  gridArea: "top"
});

export const Icon3d = styled(StyledIcon)(({ theme }) => ({
  width: "32px",
  height: "32px",
  padding: "8px",
  [`&.${classes.iconIsSelected}`]: {
    border: `2px solid ${theme.colours.cyan400}`,
    padding: "6px"
  }
}));

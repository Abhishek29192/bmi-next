import { makeStyles } from "@material-ui/styles";

export const useStyles = makeStyles(
  () => ({
    root: {},
    "@global": {
      "[class*=MuiTooltip-popper]": {
        zIndex: 9,
        "& [class*=MuiTooltip-tooltipPlacementBottom]": {
          margin: 0
        }
      }
    }
  }),
  {
    name: "ToggleCard"
  }
);

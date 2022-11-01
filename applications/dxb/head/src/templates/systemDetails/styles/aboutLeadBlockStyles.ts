import { ThemeOptions } from "@bmi-digital/components";
import { makeStyles } from "@material-ui/styles";

export const useStyles = makeStyles(
  (theme: ThemeOptions) => ({
    root: {},
    "@global": {
      "[class*=MuiBox-root]": {
        padding: 0
      }
    },

    guaranteesAndAwardsAsset: {
      "& .image": {
        height: "80px",
        paddingRight: "10px"
      },
      "&.inline-link": {
        paddingTop: "10px",
        color: "#0072b0",
        "&:hover": {
          color: "#005b8c"
        },
        transition: "color ease-out 0.25s"
      }
    },

    blueCheckIcon: {
      color: theme.colours.accent,
      "&.dark": {
        color: theme.colours.accent300
      }
    }
  }),
  { name: "aboutLeadBlock" }
);

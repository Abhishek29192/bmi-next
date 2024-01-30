import Button from "@bmi-digital/components/button";
import Icon from "@bmi-digital/components/icon";
import Drawer from "@mui/material/Drawer";
import { alpha, styled } from "@mui/material/styles";

const PREFIX = "FilterMobileStyles";
export const classes = {
  filterBox: `${PREFIX}-filterBox`,
  filterBtn: `${PREFIX}-filterBtn`,
  filterIconTitle: `${PREFIX}-filterIcon-title`
};

export const StyledFilterIcon = styled(Icon)(({ theme }) => ({
  width: "24px",
  marginRight: "12px",
  path: {
    fill: theme.colours.inter
  },
  ellipse: {
    fill: theme.colours.inter
  },
  circle: {
    fill: theme.colours.inter
  },

  [`&.${classes.filterIconTitle}`]: {
    marginRight: "10px",
    path: {
      fill: theme.colours.charcoal
    },
    ellipse: {
      fill: theme.colours.charcoal
    },
    circle: {
      fill: theme.colours.charcoal
    }
  }
}));

export const Root = styled("div")(({ theme }) => ({
  [`.${classes.filterBox}`]: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "4px"
  },
  [`.${classes.filterBtn}`]: {
    minWidth: "200px",
    maxWidth: "100%",
    marginBottom: "12px",
    transitionDuration: "280ms",
    [theme.breakpoints.down("sm")]: {
      minWidth: "100%"
    }
  }
}));

export const ClearAllButton = styled(Button)(({ theme }) => ({
  "&:disabled": {
    color: alpha(theme.colours.interDark, 0.3)
  }
}));

const filterWidth = "290px";
export const StyledDrawer = styled(Drawer)(({ theme }) => ({
  "& .MuiDrawer-paper": {
    boxSizing: "border-box",
    position: "relative",
    width: filterWidth
  }
}));

export const MobileFiltersHeaderContainer = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "6px 6px 6px 20px",
  width: filterWidth,
  position: "fixed",
  top: 0,
  zIndex: 100,
  background: "inherit"
});

export const MobileFiltersContainer = styled("div")({
  paddingTop: "60px",
  paddingBottom: "88px",
  div: {
    maxHeight: "100%"
  }
});

export const ShowResultsContainer = styled("div")(({ theme }) => ({
  padding: "24px 16px",
  width: filterWidth,
  background: theme.colours.white,
  position: "fixed",
  bottom: 0,
  left: 0,
  zIndex: 100
}));

export const ShowResultsButton = styled(Button)({
  width: "100%"
});

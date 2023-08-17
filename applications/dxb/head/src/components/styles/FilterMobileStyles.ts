import { styled } from "@mui/material/styles";

import { Icon } from "@bmi-digital/components";

const PREFIX = "FilterMobileStyles";
export const classes = {
  filterBox: `${PREFIX}-filterBox`,
  filterBtn: `${PREFIX}-filterBtn`
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
    marginBottom: "11px",
    transitionDuration: "280ms",
    [theme.breakpoints.down("sm")]: {
      minWidth: "100%"
    }
  }
}));

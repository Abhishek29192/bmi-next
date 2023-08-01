import { styled } from "@mui/material/styles";
import { Drawer } from "@mui/material";

const PREFIX = "FilterSectionStyles";
export const classes = {
  filterBox: `${PREFIX}-filterBox`,
  filterBtn: `${PREFIX}-filterBtn`,
  filterSvg: `${PREFIX}-filterSvg`
};

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
    [theme.breakpoints!.down!("sm")]: {
      minWidth: "100%"
    }
  }
}));

const filterWidth = "290px";

export const StyledDrawer = styled(Drawer)(({ theme }) => ({
  "& .MuiDrawer-paper": {
    boxSizing: "border-box",
    position: "relative",
    width: filterWidth
  },

  "& .top": {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 0px 10px 16px",
    width: filterWidth,
    position: "fixed",
    top: 0,
    zIndex: 100,
    background: "inherit"
  },

  "& .showBtn": {
    width: "100%"
  },

  "& .showBtn-box": {
    padding: "24px 16px",
    width: filterWidth,
    background: theme.colours.white,
    position: "fixed",
    bottom: 0,
    left: 0,
    zIndex: 100
  },

  "& .top-box": {
    display: "flex",

    "& svg": {
      width: "24px",
      marginRight: "14px",

      "& path": {
        fill: theme.colours.charcoal
      }
    }
  },

  "& .top-box-close": {
    color: theme.colours.slate
  },

  "& .filterContainer": {
    paddingTop: "60px",
    paddingBottom: "88px",
    div: {
      maxHeight: "100%"
    }
  }
}));

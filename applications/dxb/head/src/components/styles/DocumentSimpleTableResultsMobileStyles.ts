import { alpha, formControlLabelClasses, checkboxClasses } from "@mui/material";
import { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";

const PREFIX = "documentSimpleTableResultsMobile";
export const classes = {
  selected: `${PREFIX}-selected`
};

export const StyledListItem = styled("div")(({ theme }) => ({
  padding: "16px 0 4px",
  position: "relative",
  minHeight: "126px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",

  "&::before": {
    content: "''",
    display: "block",
    position: "absolute",
    left: "-16px",
    right: "-16px",
    bottom: 0,
    top: 0,
    borderBottom: `1px solid ${theme.colours.storm}`,
    backgroundColor: theme.colours.white,

    [theme.breakpoints.up("lg")]: {
      left: 0,
      right: 0,
      borderLeft: `1px solid ${theme.colours.storm}`,
      borderRight: `1px solid ${theme.colours.storm}`
    }
  },

  "&:first-of-type": {
    "&::before": {
      borderTop: `1px solid ${theme.colours.storm}`
    }
  },

  [`&.${classes.selected}`]: {
    "&::before": {
      borderTop: "1px solid",
      borderColor: theme.colours.accent300,
      backgroundColor: alpha(theme.colours.interDark, 0.04)
    },

    [`&+.${classes.selected}`]: {
      "&::before": {
        borderTop: 0
      }
    }
  },

  [`.${formControlLabelClasses.root} .${checkboxClasses.root}`]: {
    padding: 0
  },

  [theme.breakpoints.up("sm")]: {
    margin: "0 -8px"
  },

  [theme.breakpoints.up("lg")]: {
    paddingLeft: "16px",
    paddingRight: "16px",
    margin: 0
  }
}));

export const StyledListTitleRow = styled("div")({
  display: "flex",
  position: "relative",
  marginBottom: "8px"
});

export const StyledListRow = styled("div")(({ theme }) => ({
  color: theme.colours.slate,
  fontSize: "16px",
  paddingTop: "8px",
  zIndex: 0
}));

export const StyledListRowItem = styled("div")({
  marginLeft: "40px",
  "&:not(:first-of-type)": {
    marginTop: "6px"
  }
});

export const FieldTitle = styled("span")(({ theme }) => ({
  fontWeight: 500,
  color: theme.colours.charcoal,
  fontFamily: "Effra Medium"
}));

export const FieldValue = styled("span")({
  marginLeft: "6px"
});

export const ActionsRow = styled("div")({
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  [`&& .${tooltipClasses.tooltip}.${tooltipClasses.tooltipPlacementLeft}`]: {
    marginRight: "8px"
  }
});

export const Divider = styled("div")(({ theme }) => ({
  height: "32px",
  width: "1px",
  backgroundColor: theme.colours.storm,
  marginRight: "20px",
  zIndex: 0
}));

export const ActionBtnWrapper = styled("div")({
  padding: "12px"
});

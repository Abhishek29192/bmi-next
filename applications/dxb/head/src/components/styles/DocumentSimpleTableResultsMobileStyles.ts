import { styled } from "@mui/material/styles";
import { tooltipClasses } from "@mui/material/Tooltip";
import { classes as commonClasses } from "./DocumentSimpleTableResultsCommonStyles";

export const StyledListItem = styled("div")(({ theme }) => ({
  padding: "16px 0 8px",
  position: "relative",
  minHeight: "126px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",

  "&:nth-child(2n + 1)": {
    "&::before": {
      content: "''",
      display: "block",
      position: "absolute",
      left: "-16px",
      right: "-16px",
      bottom: 0,
      top: 0,
      "background-color": theme.colours.pearl
    }
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
  padding: "8px 0",
  position: "relative"
}));

export const StyledListRowItem = styled("div")({
  marginLeft: "40px",
  "&:not(:first-of-type)": {
    marginTop: "6px"
  }
});

export const FieldTitle = styled("span")(({ theme }) => ({
  fontWeight: 500,
  color: theme.colours.charcoal
}));

export const FieldValue = styled("span")({
  marginLeft: "6px"
});

export const Actions = styled("div")({
  display: "flex",
  justifyContent: "flex-end",
  [`.${commonClasses.actionBtnWrapper}`]: {
    "&:not(:first-of-type)": {
      marginLeft: "24px"
    }
  },
  [`&& .${tooltipClasses.tooltip}.${tooltipClasses.tooltipPlacementLeft}`]: {
    marginRight: "8px"
  }
});

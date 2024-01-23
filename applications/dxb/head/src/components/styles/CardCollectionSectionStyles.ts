import Button from "@bmi-digital/components/button";
import Grid from "@bmi-digital/components/grid";
import Typography from "@bmi-digital/components/typography";
import { styled } from "@mui/material/styles";

const PREFIX = "CardCollectionSectionStyles";

export const classes = {
  link: `${PREFIX}-link`,
  hidden: `${PREFIX}-hidden`
};

export const CardCollectionSectionContainer = styled("div")({
  [`& .${classes.link}`]: {
    marginTop: "60px"
  },

  [`& .${classes.hidden}`]: {
    position: "absolute",
    top: "-9999px",
    left: "-9999px"
  }
});

export const StyledGroupChips = styled("div")(() => ({
  display: "flex",
  flexWrap: "wrap",
  margin: "24px 0 37px"
}));

export const StyledChips = styled("div")(() => ({
  display: "flex",
  flexWrap: "wrap",
  marginRight: "14px",
  marginBottom: "11px"
}));

export const StyledClearAllButton = styled(Button)(() => ({
  height: "42px",
  fontSize: "16px",
  marginBottom: "11px",
  marginLeft: "5px"
}));

export const StyledTitle = styled(Typography)(() => ({
  marginBottom: "24px"
}));

export const StyledShowMoreGrid = styled(Grid)(() => ({
  textAlign: "center"
}));

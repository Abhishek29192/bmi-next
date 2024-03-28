import { styled } from "@mui/material/styles";
import { CardCheckboxGroup } from "./subcomponents/card-group/CardGroup";

const PREFIX = "tileOptions";
export const classes = {
  ventilationHoodsGrid: `${PREFIX}-ventilationHoodsGrid`
};

export const StyledCardCheckboxGroup = styled(CardCheckboxGroup)({
  [`& .${classes.ventilationHoodsGrid}>div:last-of-type`]: {
    minHeight: "206px"
  }
});

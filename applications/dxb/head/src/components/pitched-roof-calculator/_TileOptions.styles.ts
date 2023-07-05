import { styled } from "@mui/material/styles";
import { CardCheckboxGroup } from "./subcomponents/card-group/CardGroup";

export const StyledCardCheckboxGroup = styled(CardCheckboxGroup)(
  ({ theme }) => ({
    maxHeight: "4rem",
    overflow: "hidden",
    textOverflow: "ellipsis"
  })
);

export const StyledCardCheckboxNoneItem = styled(CardCheckboxGroup.Item)(
  ({ theme }) => ({
    minHeight: "188px"
  })
);

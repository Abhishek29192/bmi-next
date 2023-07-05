import { styled } from "@mui/material/styles";
import { CardRadioGroup } from "./subcomponents/card-group/CardGroup";

export const StyledCardRadioItemParagraph = styled(
  CardRadioGroup.Item.Paragraph
)(({ theme }) => ({
  maxHeight: "4rem",
  overflow: "hidden",
  textOverflow: "ellipsis"
}));

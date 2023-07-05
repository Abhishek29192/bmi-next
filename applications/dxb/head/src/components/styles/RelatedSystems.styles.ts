import { styled } from "@mui/material/styles";
import { Section, Button } from "@bmi-digital/components";

export const StyledLoadMoreWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  marginTop: "32px"
}));

export const StyledTitle = styled(Section.Title)(({ theme }) => ({
  marginBottom: "32px"
}));

export const StyledReadMoreButton = styled(Button)(({ theme }) => ({
  marginTop: "12px"
}));

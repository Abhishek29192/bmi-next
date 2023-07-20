import { styled } from "@mui/material/styles";
import { Section, Button } from "@bmi-digital/components";

export const StyledLoadMoreWrapper = styled("div")(() => ({
  display: "flex",
  justifyContent: "center",
  marginTop: "32px"
}));

export const StyledTitle = styled(Section.Title)(() => ({
  marginBottom: "32px"
}));

export const StyledReadMoreButton = styled(Button)(() => ({
  marginTop: "12px"
}));

export const StyledSystemPropertyContainer = styled("div")(({ theme }) => ({
  backgroundColor: theme.colours.alabaster,
  padding: "10px",
  marginTop: "15px"
}));
export const StyledSystemPropertyItem = styled("div")(() => ({
  display: "flex",
  alignItems: "flex-start",
  svg: {
    marginRight: "10px",
    height: "24px",
    width: "24px",
    path: {
      fill: "#348dbe"
    }
  }
}));

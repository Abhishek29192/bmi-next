import { styled } from "@mui/material/styles";
import RichText from "../RichText";

export const StyledRichText = styled(RichText)(({ theme }) => ({
  marginBottom: "32px"
}));

export const Iframe = styled("iframe")(({ theme }) => ({
  backgroundColor: theme.colours.white,
  border: `1px solid ${theme.colours.storm}`,
  borderWidth: "1px 0"
}));

import { styled } from "@mui/material/styles";
import { Section } from "@bmi-digital/components";

export const IframeSummary = styled(Section)(({ theme }) => ({
  marginBottom: "32px"
}));

export const Iframe = styled("iframe")(({ theme }) => ({
  backgroundColor: theme.colours.white,
  border: `1px solid ${theme.colours.storm}`,
  borderWidth: "1px 0"
}));

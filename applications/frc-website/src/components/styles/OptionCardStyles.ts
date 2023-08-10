import { styled } from "@mui/material/styles";
import { Typography } from "@bmi-digital/components";

export const StyledOptionCardContainer = styled("div")(({ theme }) => ({
  backgroundColor: `${theme.colours.pearl}`,
  padding: "48px",
  marginBottom: "24px"
}));

export const StyledTitle = styled(Typography)(() => ({
  marginBottom: "24px"
}));

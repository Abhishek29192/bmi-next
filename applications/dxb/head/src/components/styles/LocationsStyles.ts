import { styled } from "@mui/material/styles";
import { Button } from "@bmi-digital/components";

export const LocationsSection = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center"
}));

export const LocationsButton = styled(Button)(({ theme }) => ({
  marginTop: "20px"
}));

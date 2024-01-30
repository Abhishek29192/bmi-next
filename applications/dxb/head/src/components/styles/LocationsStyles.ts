import Button from "@bmi-digital/components/button";
import { styled } from "@mui/material/styles";

export const LocationsSection = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center"
}));

export const LocationsButton = styled(Button)(({ theme }) => ({
  marginTop: "20px"
}));

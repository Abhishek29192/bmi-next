import Typography from "@bmi-digital/components/typography";
import { styled } from "@mui/material/styles";

export const Filters = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "baseline",
  justifyContent: "flex-end",
  [theme.breakpoints.up("lg")]: {
    marginLeft: "15px"
  }
}));

export const Chips = styled("div")({
  marginLeft: "19px",
  marginBottom: "-5px",
  textAlign: "right"
});

export const Label = styled(Typography)({
  flexShrink: 0,
  display: "inline"
});

import Icon from "@bmi-digital/components/icon";
import Typography from "@bmi-digital/components/typography";
import { styled } from "@mui/material/styles";

export const StyledImg = styled("img")({
  width: "100%",
  height: "180px",
  objectFit: "cover",
  objectPosition: "center",
  marginBottom: "24px"
});

export const TrainingAttribute = styled(Typography)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  color: theme.colours.slate,
  marginTop: "18px"
}));

export const StyledIcon = styled(Icon)({
  width: "24px",
  height: "24px",
  marginRight: "8px",
  fill: "currentColor"
});

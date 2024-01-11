import Button from "@bmi-digital/components/button";
import Typography from "@bmi-digital/components/typography";
import { styled } from "@mui/material/styles";

export const SubTitle = styled(Typography)(({ theme }) => ({
  fontSize: "16px",
  marginTop: "12px",
  color: theme.colours.slate
}));

export const AddParticipantButton = styled(Button)(({ theme }) => ({
  marginTop: "24px",
  height: "48px",

  [theme.breakpoints.down("lg")]: {
    lineHeight: 1.625,
    height: "42px"
  }
}));

export const RemoveParticipantButton = styled(Button)(({ theme }) => ({
  paddingRight: "16px",
  paddingLeft: "16px",
  height: "48px",

  [theme.breakpoints.down("lg")]: {
    lineHeight: 1.625,
    height: "42px",
    marginLeft: "auto"
  }
}));

export const ParticipantContainer = styled("div")({
  marginTop: "12px",

  "&:first-of-type": {
    marginTop: "24px"
  }
});

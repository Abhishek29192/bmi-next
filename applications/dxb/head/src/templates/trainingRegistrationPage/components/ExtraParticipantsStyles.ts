import Button from "@bmi-digital/components/button";
import Grid from "@bmi-digital/components/grid";
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

export const ParticipantContainer = styled("div")(({ theme }) => ({
  marginTop: "12px",

  "&:first-of-type": {
    marginTop: "24px"
  },

  [theme.breakpoints.down("lg")]: {
    marginTop: "24px"
  }
}));

export const StyledGrid = styled(Grid)(({ theme }) => ({
  paddingTop: "12px",

  [theme.breakpoints.down("lg")]: {
    paddingTop: "8px"
  }
}));

import Typography from "@bmi-digital/components/typography";
import { styled } from "@mui/material/styles";

export const Root = styled("div")(({ theme }) => ({
  marginBottom: "64px",
  [theme.breakpoints.down("sm")]: {
    marginBottom: "48px"
  },

  "&:last-of-type": {
    marginBottom: 0
  }
}));

export const StyledHead = styled("div")({
  marginBottom: "24px",
  textAlign: "center"
});

export const StyledHelp = styled(Typography)({
  marginTop: "18px",
  fontSize: "18px",
  textAlign: "center"
});

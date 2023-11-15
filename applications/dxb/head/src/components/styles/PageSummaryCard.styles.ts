import Typography from "@bmi-digital/components/typography";
import { styled } from "@mui/material/styles";

export const StyledPageSummaryCard = styled("div")(({ theme }) => ({
  paddingTop: "32px",
  paddingBottom: "24px",
  width: "100%",
  "& + &": {
    borderTop: `1px solid ${theme.colours.storm}`
  }
}));

export const StyledSubtitle = styled(Typography)(({ theme }) => ({
  marginTop: "24px"
}));

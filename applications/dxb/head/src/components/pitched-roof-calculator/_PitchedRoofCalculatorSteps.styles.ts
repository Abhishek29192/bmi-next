import { styled } from "@mui/material/styles";
import { Grid } from "@mui/material";
import { AnchorLink } from "@bmi-digital/components";

export const StyledResultsGrid = styled(Grid)(({ theme }) => ({
  flexDirection: "column",
  alignItems: "center",
  width: "448px",
  margin: "0 auto",
  [theme.breakpoints.down("md")]: {
    width: "100%"
  }
}));

export const StyledCalculationReportAnchor = styled(AnchorLink)(
  ({ theme }) => ({
    color: theme.colours.white,
    backgroundColor: theme.colours.cyan500,
    textDecoration: "none",
    padding: "12px 16px",
    marginTop: "30px",
    borderRadius: "3px"
  })
);

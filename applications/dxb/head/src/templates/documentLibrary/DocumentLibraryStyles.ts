import Section from "@bmi-digital/components/section";
import { styled } from "@mui/material/styles";

const PREFIX = "documentLibrary";
export const classes = {
  resultsSection: `${PREFIX}-resultsSection`
};

export const ResultsSection = styled(Section)({
  [`&.${classes.resultsSection}`]: {
    overflow: "unset"
  }
});

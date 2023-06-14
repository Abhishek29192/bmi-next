import { Section } from "@bmi-digital/components";
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

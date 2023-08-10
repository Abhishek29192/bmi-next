import { styled } from "@mui/material/styles";
import { Accordion } from "@bmi-digital/components";

export const StyledAccordionDetails = styled(Accordion.Details)(
  ({ theme }) => ({
    display: "block",
    padding: "0px",
    backgroundColor: theme.colours.white
  })
);

import Accordion from "@bmi-digital/components/accordion";
import { styled } from "@mui/material/styles";

export const StyledAccordionDetails = styled(Accordion.Details)(
  ({ theme }) => ({
    display: "block",
    padding: "0px",
    backgroundColor: theme.colours.white
  })
);

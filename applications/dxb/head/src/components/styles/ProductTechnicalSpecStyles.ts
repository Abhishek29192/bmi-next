import Accordion from "@bmi-digital/components/accordion";
import { styled } from "@mui/material/styles";

export const ProdTecSpecAccordianDetails = styled(Accordion.Details)(
  ({ theme }) => ({
    display: "block",
    padding: 0,
    backgroundColor: "white"
  })
);

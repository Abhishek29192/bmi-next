import { styled } from "@mui/material/styles";
import { Accordion } from "@bmi-digital/components";

export const ProdTecSpecAccordianDetails = styled(Accordion.Details)(
  ({ theme }) => ({
    display: "block",
    padding: 0,
    backgroundColor: "white"
  })
);

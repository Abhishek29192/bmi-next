import Dialog from "@bmi-digital/components/dialog";
import { styled } from "@mui/material/styles";

export const StyledDialog = styled(Dialog)({
  //&& - overrides default styles
  "&&": {
    maxWidth: "448px"
  }
});

import Dialog from "@bmi-digital/components/dialog";
import { styled } from "@mui/material/styles";

export const StyledDialog = styled(Dialog)(({ theme }) => ({
  //&& - overrides default styles
  "&&": {
    maxWidth: "448px",

    [theme.breakpoints.down("lg")]: {
      maxWidth: "342px"
    }
  }
}));

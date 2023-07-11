import { inputBaseClasses } from "@mui/material";
import { styled } from "@mui/material/styles";
import { TextField } from "@bmi-digital/components";

export const StyledTextField = styled(TextField)({
  [`& .${inputBaseClasses.input}`]: {
    zIndex: 1
  }
});

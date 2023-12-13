import TextField from "@bmi-digital/components/text-field";
import { inputBaseClasses } from "@mui/material/InputBase";
import { styled } from "@mui/material/styles";

export const StyledTextField = styled(TextField)({
  [`& .${inputBaseClasses.input}`]: {
    zIndex: 1
  }
});

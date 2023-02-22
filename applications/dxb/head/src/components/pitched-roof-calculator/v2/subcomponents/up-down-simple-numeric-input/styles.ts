import { Button } from "@bmi-digital/components";
import { iconButtonClasses } from "@mui/material";
import { styled } from "@mui/material/styles";

export const StyledComponentWithButtons = styled("div")(({ theme }) => ({
  display: "inline-flex",
  "& .input": {
    margin: 0,
    display: "flex",
    flex: 1,
    "&.in-middle": {
      "[class*=MuiOutlinedInput-notchedOutline], [class*=MuiFilledInput-root], [class*=MuiFilledInput-input]":
        {
          borderTopRightRadius: "0px",
          borderBottomRightRadius: "0px",
          borderRight: "none",
          height: "48px",
          paddingBottom: "13px",
          textAlign: "center",

          borderTopLeftRadius: "0px",
          borderBottomLeftRadius: "0px",
          borderLeft: "none"
        }
    }
  }
}));

export const StyledDownButton = styled(Button)(({ theme }) => ({
  borderTopLeftRadius: "3px",
  borderBottomLeftRadius: "3px",
  height: "auto",

  [`&.${iconButtonClasses.root}`]: {
    width: "56px",
    borderTopRightRadius: "0px",
    borderBottomRightRadius: "0px"
  }
}));

export const StyledUpButton = styled(Button)(({ theme }) => ({
  borderTopRightRadius: "3px",
  borderBottomRightRadius: "3px",
  height: "auto",

  [`&.${iconButtonClasses.root}`]: {
    width: "56px",
    borderTopLeftRadius: "0px",
    borderBottomLeftRadius: "0px"
  }
}));

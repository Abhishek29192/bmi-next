import Button from "@bmi-digital/components/button";
import { filledInputClasses } from "@mui/material/FilledInput";
import { iconButtonClasses } from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";

export const StyledComponentWithButtons = styled("div")(({ theme }) => ({
  display: "inline-flex",

  [`&& .${filledInputClasses.root}`]: {
    height: "100%",
    borderRadius: 0,
    borderRight: 0,
    borderLeft: 0,

    [`.${filledInputClasses.input}`]: {
      padding: "0 12px"
    }
  },

  "& .input": {
    margin: 0,
    display: "flex",
    flex: 1
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

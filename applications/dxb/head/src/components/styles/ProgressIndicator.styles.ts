import { styled } from "@mui/material/styles";
import CircularProgress from "@mui/material/CircularProgress";

const PREFIX = "ProgressIndicatorStyles";

export const classes = {
  "progressIndicator--light": `${PREFIX}-progressIndicator--light`,
  "progressIndicator--dark": `${PREFIX}-progressIndicator--dark`
};

export const StyledProgressIndicator = styled(CircularProgress)(
  ({ theme }) => ({
    position: "fixed",
    top: "50%",
    left: "50%",
    [`.${classes["progressIndicator--dark"]}`]: {
      color: "#009fe3"
    },
    [`.${classes["progressIndicator--light"]}`]: {
      color: "#fff"
    }
  })
);

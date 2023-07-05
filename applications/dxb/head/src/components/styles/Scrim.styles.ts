import { styled } from "@mui/material/styles";

const PREFIX = "ScrimStyles";

export const classes = {
  "scrim--light": `${PREFIX}-scrim--light`,
  "scrim--dark": `${PREFIX}-scrim--dark`
};

export const StyledScrim = styled("div")(({ theme }) => ({
  position: "fixed",
  top: "0",
  left: "0",
  right: "0",
  bottom: "0",
  zIndex: "99",
  [`.${classes["scrim--dark"]}`]: {
    backgroundColor: "rgba(0, 0, 0, 0.65)"
  },
  [`.${classes["scrim--light"]}`]: {
    backgroundColor: "rgba(255, 255, 255, 0.65)"
  }
}));

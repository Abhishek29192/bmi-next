import { styled } from "@mui/material/styles";
import Alert from "@mui/material/Alert";

export const LoginAlertStyles = styled(Alert)(() => ({
  display: "flex",
  alignItems: "center",
  position: "absolute",
  bottom: "-24px",
  left: "50%",
  transform: "translate(-50%, 0%)"
}));

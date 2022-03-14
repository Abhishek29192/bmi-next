import { makeStyles } from "@material-ui/styles";

export const useStyles = makeStyles(
  () => ({
    root: {
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      boxShadow:
        "0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 5px 8px 0px rgba(0, 0, 0, 0.14), 0px 1px 14px 0px rgba(0, 0, 0, 0.12)",
      "&.MuiButtonBase-root": {
        borderRadius: "50%"
      }
    },
    left: {
      left: 0,
      transform: "translate(-50%, -50%)"
    },
    right: {
      right: 0,
      transform: "translate(50%, -50%)"
    },
    chevron: {
      width: "32px",
      height: "32px"
    }
  }),
  { name: "ArrowControl" }
);

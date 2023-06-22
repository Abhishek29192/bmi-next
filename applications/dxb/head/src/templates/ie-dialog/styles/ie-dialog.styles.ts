import { styled } from "@mui/material/styles";

const PREFIX = "IEDialogStyles";

export const classes = {
  "IEDialog-title": `${PREFIX}-IEDialog-title`,
  "IEDialog-icon": `${PREFIX}-IEDialog-icon`,
  "IEDialog-body": `${PREFIX}-IEDialog-body`,
  "IEDialog-actions": `${PREFIX}-IEDialog-actions`,
  "IEDialog-wrapper": `${PREFIX}-IEDialog-wrapper`
};

export const StyledIEDialog = styled("div")(({ theme }) => ({
  maxWidth: "720px",
  [`.${classes["IEDialog-title"]}`]: {
    textAlign: "center",
    margin: "40px 80px 20px",
    fontSize: "2rem",
    "&::after": {
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  [`.${classes["IEDialog-icon"]}`]: {
    display: "block",
    fill: theme.colours.cyan400,
    height: "50px",
    width: "50px",
    margin: "0 auto 10px"
  },
  [`.${classes["IEDialog-icon"]}`]: {
    textAlign: "center"
  },
  [`.${classes["IEDialog-actions"]}`]: {
    display: "flex",
    flex: "0 0 auto",
    flexFlow: "row nowrap",
    justifyContent: "center",
    padding: "0 30px 30px 30px",
    margin: "-8px"
  }
}));

export const StyledIEDialogWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  position: "fixed",
  top: "0",
  bottom: "0",
  right: "0",
  left: "0",
  justifyContent: "center",
  alignItems: "center"
}));

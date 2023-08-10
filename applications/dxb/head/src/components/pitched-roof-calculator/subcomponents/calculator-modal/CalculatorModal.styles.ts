import { styled } from "@mui/material/styles";

const PREFIX = "CalculatorModal";

export const classes = {
  pearl: `${PREFIX}-pearl`,
  white: `${PREFIX}-white`,
  header: `${PREFIX}-header`,
  headerContainer: `${PREFIX}-headerContainer`,
  headerSide: `${PREFIX}-headerSide`,
  headerCentre: `${PREFIX}-headerCentre`,
  logo: `${PREFIX}-logo`,
  iconButton: `${PREFIX}-iconButton`,
  content: `${PREFIX}-content`
};

export const Root = styled("div")(({ theme }) => ({
  position: "absolute",
  top: "0",
  left: "0",
  boxShadow: "elevation(24)",
  borderRadius: "3px",
  outline: "none",
  width: "100%",
  height: "100%",
  display: "flex",
  flexFlow: "column nowrap",

  [`.${classes.header}`]: {
    display: "flex",
    flex: "0 0 auto",
    flexFlow: "row nowrap",
    justifyContent: "flexEnd"
  },
  [`.${classes.headerContainer}`]: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  [`.${classes.headerSide}`]: {
    display: "flex",
    flex: "0 0 auto"
  },
  [`.${classes.headerCentre}`]: {
    flex: "1 1 auto",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "0 24px"
  },
  [`.${classes.logo}`]: {
    width: "50px",
    margin: "10px 0",
    [theme.breakpoints.down("md")]: {
      width: "80px"
    }
  },
  [`.${classes.iconButton}`]: {
    color: theme.colours.charcoal
  },
  [`.${classes.content}`]: {
    flex: "1 1 auto",
    overflowY: "scroll",
    marginBottom: "24px",
    padding: "0 30px"
  },
  [`.${classes.pearl}`]: {
    backgroundColor: theme.colours.pearl
  },
  [`.${classes.white}`]: {
    backgroundColor: theme.colours.white
  }
}));

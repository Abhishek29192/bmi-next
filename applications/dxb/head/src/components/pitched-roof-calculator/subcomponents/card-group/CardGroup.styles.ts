import { styled } from "@mui/material/styles";

const PREFIX = "CardRadioGroup";

export const classes = {
  root: `${PREFIX}-root`,
  gridContainer: `${PREFIX}-gridContainer`
};

export const Root = styled("div")(({ theme }) => ({
  [`.${classes.root}`]: {
    width: "100%"
  },
  [`.${classes.gridContainer}`]: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    margin: "-8px 0",
    [`& > div`]: {
      [theme.breakpoints.down("xs")]: {
        width: "200px",
        maxWidth: "unset",
        flexBasis: "unset",
        padding: "0",
        margin: "8px"
      }
    }
  }
}));

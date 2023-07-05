import { styled } from "@mui/material/styles";

const PREFIX = "Alert";

export const classes = {
  first: `${PREFIX}-first`,
  last: `${PREFIX}-first`
};

export const Root = styled("div")(({ theme }) => ({
  margin: "0px -30px",
  [`.${classes.first}`]: {
    marginTop: "60px"
  },
  [`.${classes.last}`]: {}
}));

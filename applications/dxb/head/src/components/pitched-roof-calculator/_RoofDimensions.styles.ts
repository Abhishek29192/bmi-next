import { styled } from "@mui/material/styles";

const PREFIX = "RoofDimensions";

export const classes = {
  illustration: `${PREFIX}-illustration`,
  form: `${PREFIX}-form`
};

export const Root = styled("div")(({ theme }) => ({
  [`& .${classes.illustration}`]: {
    display: "block",
    margin: "0 auto",
    [theme.breakpoints.up("lg")]: {
      width: "350px"
    }
  },
  [`& .${classes.form}`]: {
    margin: "0 auto 48px",
    [theme.breakpoints.up("lg")]: {
      marginBottom: "66px",
      width: "66%"
    }
  }
}));

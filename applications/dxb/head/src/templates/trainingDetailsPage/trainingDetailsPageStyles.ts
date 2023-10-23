import { styled } from "@mui/material/styles";
import { alpha } from "@mui/material";
import {
  Typography,
  Container as MUIContainer,
  Button
} from "@bmi-digital/components";

export const Wrapper = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  background: theme.colours.white
}));

export const DetailsContainer = styled("div")({
  width: "70%"
});

export const Container = styled(MUIContainer)({
  margin: "1rem 0"
});

export const Title = styled(Typography)({
  lineHeight: 1.2,
  "&::after": {
    marginLeft: "1px"
  },
  "&>svg": {
    display: "block",
    marginBottom: "24px"
  }
});

export const CourseDescription = styled("div")(({ theme }) => ({
  margin: "1rem 0",
  "& h3": {
    "&::after": {
      content: '""',
      display: "block",
      width: "70px",
      height: "3px",
      marginTop: "6px",
      background: theme.colours.cyan400
    }
  },

  "& ul": {
    paddingLeft: "20px !important",
    "& li": {
      listStyleType: "square",
      marginBottom: "5px !important",

      "&::marker": {
        color: theme.colours.cyan400
      }
    }
  },

  "& hr": {
    flexShrink: 0,
    backgroundColor: alpha(theme.colours.black, 0.12),
    border: "none",
    height: "1px"
  },

  "& a": {
    color: theme.colours.cyan400
  }
}));

export const SessionContainer = styled("div")(({ theme }) => ({
  background: theme.colours.pearl,
  padding: "30px"
}));

export const SessionDataContainer = styled("div")<{
  index: number;
  dataLength: number;
}>(({ theme, index, dataLength }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  alignSelf: "stretch",
  border: `1px solid ${theme.colours.storm}`,
  borderBottom:
    index === dataLength - 1 ? `1px solid $${theme.colours.storm}` : "none",
  padding: "13px 16px",
  width: "70%",
  background: theme.colours.white,

  [theme.breakpoints.down("lg")]: {
    width: "100%"
  }
}));

export const SessionDetailContainer = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  width: "100%",

  [theme.breakpoints.down("lg")]: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center"
  }
}));

export const SessionName = styled(Typography)(({ theme }) => ({
  color: "#6F6F6F",
  fontSize: "18px",
  fontWeight: "400",
  minWidth: "25%",
  maxWidth: "25%",

  [theme.breakpoints.down("lg")]: {
    minWidth: "100%",
    maxWidth: "100%",
    marginBottom: "1rem"
  }
}));

export const SessionInterval = styled(Typography)(({ theme }) => ({
  alignItems: "center",
  width: "100%",
  fontSize: "18px",
  fontWeight: "400",
  minWidth: "50%",
  maxWidth: "50%",

  [theme.breakpoints.down("lg")]: {
    minWidth: "100%",
    maxWidth: "100%",
    marginBottom: "1rem",
    fontSize: "16px"
  }
}));

export const EnrollButtonContainer = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-end",
  minWidth: "25%",

  [theme.breakpoints.down("lg")]: {
    width: "100%"
  }
}));

export const EnrollButton = styled(Button)({
  padding: "4px 35px",
  fontSize: "18px",
  fontWeight: "400",
  width: "100%"
});

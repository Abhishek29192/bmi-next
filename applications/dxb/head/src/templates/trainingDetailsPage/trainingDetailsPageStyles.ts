import { styled } from "@mui/material/styles";
import { alpha } from "@mui/material";
import { Typography } from "@bmi-digital/components";

export const Container = styled("div")({
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

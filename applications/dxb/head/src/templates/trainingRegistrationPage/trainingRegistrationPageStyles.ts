import { styled } from "@mui/material/styles";
import Icon from "@bmi-digital/components/icon/Icon";
import Typography from "@bmi-digital/components/typography";

export const TrainingDataContainer = styled("div")(({ theme }) => ({
  display: "flex",
  gap: "5%",
  fontSize: "18px",

  [theme.breakpoints.up("lg")]: {
    alignItems: "center"
  },
  [theme.breakpoints.down("lg")]: {
    flexDirection: "column"
  }
}));

export const TrainingDetailContainer = styled("div")(({ theme }) => ({
  [theme.breakpoints.down("lg")]: {
    display: "flex",

    "&:not(:first-of-type)": {
      marginTop: "12px"
    }
  }
}));

export const TrainingLabel = styled(Typography)(({ theme }) => ({
  color: theme.colours.slate
}));

export const TrainingDesc = styled(Typography)(({ theme }) => ({
  fontWeight: "400",
  display: "flex",
  alignItems: "center",
  color: theme.colours.charcoal,
  "& svg": {
    marginRight: "8px"
  },
  [theme.breakpoints.up("lg")]: {
    marginTop: "12px"
  },
  [theme.breakpoints.down("lg")]: {
    marginLeft: "12px"
  }
}));

export const StyledIcon = styled(Icon)({
  height: "24px",
  width: "24px"
});

export const TrainingSeparation = styled("div")(({ theme }) => ({
  borderLeft: `1px solid ${theme.colours.storm}`,
  height: "50px",

  [theme.breakpoints.down("lg")]: {
    display: "none"
  }
}));

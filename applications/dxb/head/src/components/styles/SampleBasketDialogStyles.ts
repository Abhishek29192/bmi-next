import IconButton from "@bmi-digital/components/icon-button";
import Typography from "@bmi-digital/components/typography";
import { iconButtonClasses } from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";

export const StyledBasketDialogContainer = styled("div")(({ theme }) => ({
  backgroundColor: theme.colours.white,
  border: `1px solid ${theme.colours.storm}`,
  height: "100vh",
  position: "fixed",
  right: 0,
  top: 0,
  width: "315px",
  zIndex: 13,
  [theme.breakpoints!.down!("md")]: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between"
  },
  [theme.breakpoints!.up!("lg")]: {
    position: "inherit",
    height: "auto",
    top: "auto",
    zIndex: 11,
    width: "566px",
    right: "20px"
  }
}));

export const TopContainer = styled("div")(({ theme }) => ({
  padding: "30px",
  paddingBottom: "24px",
  [theme.breakpoints!.down!("md")]: {
    padding: "30px 16px"
  }
}));

export const CloseButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: `${theme.colours.white} !important`,
  color: `${theme.colours.slate} !important`,
  position: "absolute",
  right: 0,
  top: 0,
  zIndex: 2,
  [`&.${iconButtonClasses.root}:hover`]: {
    backgroundColor: `${theme.colours.pearl} !important`,
    color: `${theme.colours.charcoal} !important`
  }
}));

export const CartInfo = styled("div")(({ theme }) => ({
  fontSize: "1rem",
  color: theme.colours.slate,
  fontFamily: "Effra Regular",
  "&>p": {
    margin: 0,
    "&:last-of-type": {
      marginTop: "12px"
    }
  }
}));

export const CartImage = styled("img")(({ theme }) => ({
  maxWidth: "110px",
  height: "80px",
  [theme.breakpoints!.down!("md")]: {
    maxWidth: "64px",
    height: "60px"
  }
}));

export const ProductList = styled("div")(({ theme }) => ({
  maxHeight: "calc(100vh - 170px - 350px)",
  minHeight: "80px",
  overflowY: "scroll",
  [theme.breakpoints!.down!("md")]: {
    maxHeight: "calc(100vh - 350px)",
    overflowY: "scroll",
    flex: 1
  }
}));

export const Product = styled("div")(({ theme }) => ({
  display: "flex",
  padding: "12px 30px",
  "&:nth-of-type(odd)": {
    backgroundColor: theme.colours.pearl
  },
  "&:nth-of-type(even)": {
    backgroundColor: theme.colours.white
  }
}));

export const ImageContainer = styled("div")(({ theme }) => ({
  maxWidth: "125px",
  display: "flex",
  padding: "8px 0",
  marginRight: "45px",
  alignItems: "center",
  [theme.breakpoints!.down!("md")]: {
    width: "80px",
    marginRight: "24px"
  }
}));

export const InfoContainer = styled("div")(({ theme }) => ({
  flex: 1
}));

export const ProductTitle = styled(Typography)(({ theme }) => ({
  color: theme.colours.charcoal,
  marginBottom: "12px"
}));

export const ProductColour = styled(Typography)(({ theme }) => ({
  color: theme.colours.slate,
  marginBottom: "12px"
}));

export const ProductSize = styled(Typography)(({ theme }) => ({
  fontSize: "16px",
  color: theme.colours.slate,
  fontFamily: "Effra Regular"
}));

export const ProductButtonContainer = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginLeft: "12px",
  color: theme.colours.inter,
  "& button": {
    width: "48px",
    minWidth: "48px",
    height: "48px",
    "& svg": {
      height: "24px",
      width: "24px"
    }
  }
}));

export const CartActions = styled("div")(({ theme }) => ({
  padding: "30px",
  display: "flex",
  flexDirection: "column",
  marginLeft: "16px",
  "& > *": {
    width: "100%",
    "&:last-child": {
      marginTop: "16px"
    }
  }
}));

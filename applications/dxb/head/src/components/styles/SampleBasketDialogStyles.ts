import { styled } from "@mui/material/styles";

const PREFIX = "SampleBasketDialog";

export const classes = {
  cartDrawer: `${PREFIX}-cartDrawer`,
  productList: `${PREFIX}-productList`,
  row: `${PREFIX}-row`,
  imageContainer: `${PREFIX}-imageContainer`,
  infoContainer: `${PREFIX}-infoContainer`,
  buttonContainer: `${PREFIX}-buttonContainer`,
  cartImage: `${PREFIX}-cartImage`,
  cartInfo: `${PREFIX}-cartInfo`,
  cartActions: `${PREFIX}-cartActions`,
  closeButton: `${PREFIX}-closeButton`
};

export const StyledBasketDialogContainer = styled("div")(({ theme }) => ({
  [`& .${classes.cartDrawer}`]: {
    backgroundColor: theme.colours.white,
    border: `1px solid ${theme.colours.storm}`,
    height: "100vh",
    position: "fixed",
    right: 0,
    top: 0,
    width: "315px",
    zIndex: 13,
    "& .pad": {
      padding: "30px",
      [theme.breakpoints!.down!("md")]: {
        padding: "30px 16px"
      }
    },
    "& .pad-b-24": {
      paddingBottom: "24px"
    },
    [theme.breakpoints!.down!("md")]: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between"
    },
    [theme.breakpoints!.up!("md")]: {
      position: "inherit",
      height: "auto",
      top: "auto",
      zIndex: 11,
      width: "566px",
      right: "20px"
    }
  },
  [`& .${classes.productList}`]: {
    maxHeight: "calc(100vh - 170px - 350px)",
    minHeight: "80px",
    overflowY: "scroll",
    [theme.breakpoints!.down!("md")]: {
      maxHeight: "calc(100vh - 350px)",
      overflowY: "scroll",
      flex: 1
    }
  },
  [`& .${classes.row}`]: {
    display: "flex",
    padding: "12px 30px",
    "&:nth-child(odd)": {
      backgroundColor: theme.colours.pearl
    },
    "&:nth-child(even)": {
      backgroundColor: theme.colours.white
    }
  },
  [`& .${classes.imageContainer}`]: {
    width: "125px",
    display: "flex",
    padding: "12px 0",
    alignItems: "center",
    [theme.breakpoints!.down!("md")]: {
      width: "80px"
    }
  },
  [`& .${classes.infoContainer}`]: {
    flex: 1,
    "& .product-title": {
      color: theme.colours.charcoal,
      marginBottom: "12px"
    },
    "& .product-color": {
      color: theme.colours.slate,
      marginBottom: "12px"
    },
    "& .product-size": {
      fontSize: "16px",
      color: theme.colours.slate,
      fontFamily: "Effra Regular"
    }
  },
  [`& .${classes.buttonContainer}`]: {
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
  },
  [`& .${classes.cartImage}`]: {
    maxWidth: "110px",
    height: "80px",
    [theme.breakpoints!.down!("md")]: {
      maxWidth: "64px",
      height: "60px"
    }
  },
  [`& .${classes.cartInfo}`]: {
    fontSize: "1rem",
    color: theme.colours.slate,
    fontFamily: "Effra Regular",
    "&:first-child": {
      marginTop: "24px"
    }
  },
  [`& .${classes.cartActions}`]: {
    display: "flex",
    "& > *": {
      width: "50%",

      "&:last-child": {
        marginLeft: "16px"
      }
    },
    [theme.breakpoints!.up!("md")]: {
      flexDirection: "column",
      "& > *": {
        width: "100%",
        "&:last-child": {
          marginLeft: 0,
          marginTop: "16px"
        }
      }
    }
  },
  [`& .${classes.closeButton}`]: {
    backgroundColor: theme.colours.white,
    color: theme.colours.slate,
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 2,

    "&:hover": {
      backgroundColor: theme.colours.pearl,
      color: theme.colours.charcoal
    }
  }
}));

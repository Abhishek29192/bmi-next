import { styled } from "@mui/material/styles";

const PREFIX = "SampleBasketSectionProducts";

export const classes = {
  product: `${PREFIX}-product`,
  "product-wrapper": `${PREFIX}-product-wrapper`,
  "product-image": `${PREFIX}-product-image`,
  "product-title": `${PREFIX}-product-title`,
  "product-color": `${PREFIX}-product-color`,
  "product-size": `${PREFIX}-product-size`,
  "product-button": `${PREFIX}-product-button`,
  "product-description": `${PREFIX}-product-description`
};

export const StyledSampleBasketSection = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "stretch",
  flexWrap: "wrap",
  [theme.breakpoints.down("lg")]: {
    flexDirection: "column"
  },
  [`.${classes["product"]}`]: {
    [theme.breakpoints.down("lg")]: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  },
  [`.${classes["product-wrapper"]}`]: {
    flexGrow: "0",
    height: "auto",
    marginBottom: "1rem",
    marginRight: "1rem",
    "&:last-child": {
      marginRight: "0"
    },
    [theme.breakpoints.up("lg")]: {
      maxWidth: "calc(33% - 1rem)",
      flexBasis: "calc(33% - 1rem)"
    },
    //original media query breakpoint was!!
    // @media (min-width: 1100px)
    [theme.breakpoints.up("md")]: {
      maxWidth: "calc(25% - 1rem)",
      flexBasis: "calc(25% - 1rem)"
    },
    [theme.breakpoints.up("xl")]: {
      maxWidth: "calc(20% - 0.8rem)",
      flexBasis: "calc(20% - 0.8rem)"
    },
    [theme.breakpoints.down("lg")]: {
      maxWidth: "initial",
      marginRight: "0",
      alignItems: "center",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      boxShadow: "none",
      borderTop: `1px solid ${theme.colours.storm}`
    }
  },
  [`.${classes["product-image"]}`]: {
    marginTop: "20px",
    padding: "0 42px",
    marginBottom: "-10px",
    [theme.breakpoints.down("lg")]: {
      margin: "0",
      padding: "20px 0 20px 20px",
      height: "100px",
      width: "100px"
    }
  },
  [`.${classes["product-title"]}`]: {
    fontSize: "16px",
    fontFamily: "Effra Medium",
    marginBottom: "30px",
    color: theme.colours.cyan600,
    //original media query breakpoint was!!
    // @media (min-width: 1100px)
    [theme.breakpoints.up("md")]: {
      fontSize: "22.5px"
    },
    [theme.breakpoints.down("lg")]: {
      fontXize: "20px",
      marginBottom: "10px"
    }
  },
  [`.${classes["product-color"]}`]: {
    fontSize: "16px",
    fontFamily: "Effra Medium",
    marginBottom: "20px",
    color: theme.colours.slate,
    //original media query breakpoint was!!
    // @media (min-width: 1100px)
    [theme.breakpoints.up("md")]: {
      fontSize: "20.25px"
    },
    [theme.breakpoints.down("lg")]: {
      fontSize: "18px",
      marginBottom: "5px"
    }
  },
  [`.${classes["product-size"]}`]: {
    fontSize: "16px",
    fontFamily: "Effra Medium",
    marginBottom: "24px",
    color: theme.colours.slate,
    [theme.breakpoints.down("lg")]: {
      marginBottom: "0"
    }
  },
  [`.${classes["product-button"]}`]: {
    [theme.breakpoints.up("lg")]: {
      width: "100%"
    },
    [theme.breakpoints.down("lg")]: {
      width: "48px",
      border: `1px solid ${theme.colours.cyan500}`,
      color: `${theme.colours.cyan500}`
    }
  }
}));

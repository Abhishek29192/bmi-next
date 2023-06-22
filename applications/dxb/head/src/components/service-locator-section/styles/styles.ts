import {
  Tabs,
  tabsClasses,
  Card,
  CardContent,
  Typography,
  Button
} from "@bmi-digital/components";
import { styled } from "@mui/material";
import Image from "../../Image";

export const ResultListTabPanel = styled(Tabs.TabPanel)(({ theme }) => ({
  width: "100%",
  [theme.breakpoints!.up!("lg")]: {
    width: "33.3333333333%",
    [`&.${tabsClasses.tabPanelBox}`]: {
      paddingRight: 0,
      paddingLeft: 0
    }
  }
}));

export const MapTabPanel = styled(Tabs.TabPanel)(({ theme }) => ({
  width: "100%",
  [theme.breakpoints!.up!("lg")]: {
    maxWidth: "66.6666666667%",
    [`&.${tabsClasses.tabPanelBox}`]: {
      paddingRight: 0
    }
  }
}));

export const StyledServiceLocatorMap = styled("div")(({ theme }) => ({
  height: "calc(100vh - 48px)",
  [theme.breakpoints!.up!("lg")]: {
    height: "640px"
  }
}));

const PRODUCTDETAILSCARDPREFIX = "ProductDetailsCard";

export const productDetailsCardClasses = {
  withLogo: `${PRODUCTDETAILSCARDPREFIX}-withLogo`,
  closeBtn: `${PRODUCTDETAILSCARDPREFIX}-close-button`
};

export const ProductDetailsCard = styled(Card)(({ theme }) => ({
  borderRadius: "0",
  position: "relative",
  overflow: "visible",
  "&:before": {
    content: '""',
    position: "absolute",
    width: "0",
    height: "0",
    top: "-18px",
    left: "50%",
    marginLeft: "-5px",
    boxSizing: "border-box",
    transformOrigin: "0 0",
    borderStyle: "solid",
    borderWidth: "0 9px 18px 9px",
    borderColor: "transparent transparent #ffffff transparent"
  },
  [`&.${productDetailsCardClasses.withLogo}`]: {
    '& [class*="MuiCardHeader-root"]': {
      flexWrap: "wrap",
      justifyContent: "space-between"
    },
    '& [class*="MuiCardHeader-content"]': {
      order: "3",
      width: "100%"
    }
  },
  // rewrite global styles
  "& .MuiCardHeader-title": {
    fontWeight: "bold",
    marginBottom: "6px",
    [theme.breakpoints!.up!("lg")]: {
      marginBottom: "18px"
    }
  },
  "& .MuiCardHeader-root": {
    padding: "30px 30px 0"
  },
  "& .MuiCardContent-root": {
    padding: "0 30px 12px"
  },
  "& .MuiCardHeader-action": {
    marginTop: "-24px",
    marginRight: "-24px"
  },
  "& .MuiCardHeader-avatar": {
    marginRight: "0"
  }
}));

const COMPANYLOGOPREFIX = "CompanyLogo";

export const companyLogoClasses = {
  card: `${COMPANYLOGOPREFIX}-card`
};

export const CompanyLogo = styled(Image)(({ theme }) => ({
  marginBottom: "18px",
  height: "40px",
  maxWidth: "91px",
  img: {
    height: "40px"
  },
  [`&.${companyLogoClasses.card}`]: {
    marginBottom: "30px",
    height: "60px",
    maxWidth: "135px",
    img: {
      height: "60px"
    }
  }
}));
export const CloseBtn = styled(Button)(({ theme }) => ({
  svg: {
    color: theme.colours.slate
  },
  "&:hover": {
    svg: {
      color: theme.colours.charcoal
    }
  }
}));

export const ProductDetailsCardBody = styled(CardContent)(({ theme }) => ({
  overflowY: "auto"
}));

export const ProductDetailsCardSummary = styled(Typography)(({ theme }) => ({
  marginBottom: "18px"
}));

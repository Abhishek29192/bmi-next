import React from "react";
import Button from "@bmi/button";
import ExpandableCard from "@bmi/expandable-card";
import Typography from "@bmi/typography";
import IconList from "@bmi/icon-list";
import BuildIcon from "@material-ui/icons/Build";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
import LocalShippingIcon from "@material-ui/icons/LocalShipping";
import ReportProblemIcon from "@material-ui/icons/ReportProblem";
import InfoIcon from "@material-ui/icons/Info";
import FindReplaceIcon from "@material-ui/icons/FindReplace";
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser";
import HelpIcon from "@material-ui/icons/Help";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import EmojiObjectsOutlinedIcon from "@material-ui/icons/EmojiObjectsOutlined";

const Body = ({ isShort }: { isShort?: boolean }) => {
  return (
    <>
      {/* @ts-ignore */}
      <Typography component="h4" variant="h6">
        Did you know?
      </Typography>
      <IconList>
        <IconList.Item
          icon={<EmojiObjectsOutlinedIcon style={{ color: "#009FE3" }} />}
          title="You can check relevant technical information whilst browsing our site"
          component="h5"
        >
          {!isShort && (
            <Typography>
              Technical product information such as performance guarantees,
              dimensions, colours etc. are documented in our technical
              documentation.
            </Typography>
          )}
        </IconList.Item>
        {!isShort && (
          <IconList.Item
            icon={<EmojiObjectsOutlinedIcon style={{ color: "#009FE3" }} />}
            title="Our installation instructions show how a product is assembled"
            component="h5"
          >
            <Typography>
              If you need help with mounting a product or accessory, our
              mounting instructions show how a product is assembled and what
              accessories should be used, if any.
            </Typography>
          </IconList.Item>
        )}
      </IconList>
    </>
  );
};
const Footer = () => {
  return (
    <>
      <Typography variant="h6" style={{ marginBottom: "16px" }}>
        Still need help?
      </Typography>

      <Button endIcon={<ArrowForwardIcon />} variant="outlined">
        View contact details
      </Button>
    </>
  );
};

const items = [
  {
    icon: BuildIcon,
    title: "Technical queries",
    body: <Body />,
    footer: <Footer />
  },
  {
    icon: AddShoppingCartIcon,
    title: "Place, change or cancel order",
    body: <Body isShort />,
    footer: <Footer />
  },
  {
    icon: LocalShippingIcon,
    title: "Delivery information",
    body: <Body />,
    footer: <Footer />
  },
  {
    icon: ReportProblemIcon,
    title: "Problems with a product",
    body: <Body isShort />,
    footer: <Footer />
  },
  {
    icon: InfoIcon,
    title: "Product information",
    body: <Body />,
    footer: <Footer />
  },
  {
    icon: FindReplaceIcon,
    title: "Returns and replacements",
    body: <Body />
  },
  {
    icon: VerifiedUserIcon,
    title: "Guarantee information",
    body: <Body />,
    footer: <Footer />
  },
  {
    icon: HelpIcon,
    title: "General queries",
    body: <Body isShort />,
    footer: <Footer />
  }
];

const IntegratedExpandableCard = () => {
  return <ExpandableCard.List items={items} />;
};

export default IntegratedExpandableCard;

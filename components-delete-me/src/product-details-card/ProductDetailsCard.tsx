import { SVGImport } from "@bmi-digital/svg-import";
import React from "react";
import AnchorLink from "../anchor-link/AnchorLink";
import { ClickableAction } from "../clickable/Clickable";
import Media, { AcceptedNode } from "../media/Media";
import MicroCopy from "../micro-copy/MicroCopy";
import Typography from "../typography/Typography";
import { useStyles } from "./styles";

type Props = {
  media?: React.ReactElement<AcceptedNode>;
  brandLogo: SVGImport;
  title: React.ReactNode;
  nnob: React.ReactNode;
  action?: ClickableAction;
  linkLabel: React.ReactNode;
};

const ProductDetailsCard = ({
  media,
  brandLogo,
  title,
  nnob,
  action,
  linkLabel
}: Props) => {
  const BrandLogo = brandLogo;
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Media className={classes.headerPicture} size="contain">
        {media}
      </Media>
      <div className={classes.body}>
        <BrandLogo
          preserveAspectRatio="xMinYMin"
          className={classes.brandLogo}
        />
        <Typography variant="h5" className={classes.title}>
          {title}
        </Typography>
        <Typography>
          <MicroCopy path="productDetailsCard.externalRefLabel" />:{" "}
          <span className={classes.boldNobb}>{nnob}</span>
        </Typography>
        <AnchorLink action={action} iconEnd className={classes.link}>
          {linkLabel}
        </AnchorLink>
      </div>
    </div>
  );
};

export default ProductDetailsCard;

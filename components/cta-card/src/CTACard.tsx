import React from "react";
import Card from "@bmi/card";
import Typography from "@bmi/typography";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import { ButtonBase, ButtonBaseProps } from "@material-ui/core";
import classnames from "classnames";
import { withClickable } from "@bmi/clickable";
import Media, { AcceptedNode } from "@bmi/media";
import styles from "./CTACard.module.scss";

type Props = ButtonBaseProps & {
  buttonComponent?: React.ComponentType<any>; // TODO
  /**
   * @deprecated Use media instead.
   */
  imageSource?: string | React.ReactNode;
  media?: React.ReactElement<AcceptedNode>;
  title: React.ReactNode;
};

const __DeprecatedImageSource = ({
  imageSource
}: Pick<Props, "imageSource">) => {
  if (!imageSource) {
    return null;
  }

  return (
    <div
      className={styles["image"]}
      style={
        typeof imageSource === "string"
          ? { backgroundImage: `url(${imageSource})` }
          : {}
      }
    >
      {typeof imageSource !== "string" && imageSource}
    </div>
  );
};

const CTACard = ({
  buttonComponent: Button = ButtonBase,
  imageSource,
  media,
  title,
  className,
  ...rest
}: Props) => {
  const btnAction = typeof imageSource === "string" ? rest : null;
  return (
    <ButtonBase
      className={classnames(styles["Card"], className)}
      {...btnAction}
    >
      <Card className={styles["body"]}>
        <section className={styles["top-box"]}>
          <Button {...rest} disableRipple>
            <Typography variant="h5" className={styles["heading"]}>
              {title}
              <ArrowForwardIcon className={styles["icon"]} />
            </Typography>
          </Button>
        </section>
        <__DeprecatedImageSource imageSource={imageSource} />
        <Media>{media}</Media>
      </Card>
    </ButtonBase>
  );
};

export default withClickable(CTACard);

import React from "react";
import Card from "@bmi/card";
import Typography from "@bmi/typography";
import ButtonBase, { ButtonBaseProps } from "@material-ui/core/ButtonBase";
import classnames from "classnames";
import styles from "./ToggleCard.module.scss";

export type Props = {
  title?: React.ReactNode;
  imageSource?: string;
  illustratedImage?: SVGImport;
} & (
  | ({ component: "div" } & Omit<ButtonBaseProps<"div">, "component">)
  | ({ component?: "button" } & Omit<
      ButtonBaseProps<"button">,
      "component" | "type"
    >)
);

const ToggleCard = ({
  title,
  imageSource,
  illustratedImage,
  disabled,
  className,
  children,
  component = "div",
  ...rest
}: Props) => {
  const Illustration = illustratedImage;
  const titleOnly = title && !imageSource && !illustratedImage;

  return (
    <ButtonBase
      component={component}
      disabled={disabled}
      className={classnames(
        styles["ToggleCard"],
        {
          [styles["ToggleCard--disabled"]!]: disabled
        },
        className
      )}
      {...rest}
    >
      <Card className={styles["body"]}>
        {imageSource ? (
          <div
            className={classnames(styles["image"])}
            style={{ backgroundImage: `url(${imageSource})` }}
          />
        ) : null}
        {Illustration ? <Illustration preserveAspectRatio="xMidYMid" /> : null}
        {title ? (
          <Typography
            variant="h6"
            className={classnames(styles["title"], {
              [styles["title--only"]!]: titleOnly
            })}
          >
            {title}
          </Typography>
        ) : null}
        {children}
      </Card>
    </ButtonBase>
  );
};

type ParagraphProps = {
  className?: string;
  children: React.ReactNode;
};

const Paragraph = ({ className, children }: ParagraphProps) => (
  <Typography className={classnames(styles["paragraph"], className)}>
    {children}
  </Typography>
);

ToggleCard.Paragraph = Paragraph;

export default ToggleCard;
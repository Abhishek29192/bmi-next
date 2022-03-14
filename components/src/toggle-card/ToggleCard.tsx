import { SVGImport } from "@bmi-digital/svg-import";
import { ButtonBase, ButtonBaseProps } from "@material-ui/core";
import classnames from "classnames";
import React from "react";
import Card from "../card/Card";
import Typography from "../typography/Typography";
import { useStyles } from "./styles";

export type Props = {
  title?: React.ReactNode;
  imageSource?: string;
  illustratedImage?: SVGImport;
} & ({ component?: "div" | "button" } & Omit<
  ButtonBaseProps<"div">,
  "component"
>);

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
  const classes = useStyles();
  return (
    <ButtonBase
      component={component}
      disabled={disabled}
      className={classnames(
        classes.root,
        disabled && classes.disabled,
        className
      )}
      {...rest}
    >
      <Card className={classes.body}>
        {imageSource ? (
          <div
            className={classnames(classes.image)}
            style={{ backgroundImage: `url(${imageSource})` }}
          />
        ) : null}
        {Illustration ? <Illustration preserveAspectRatio="xMidYMid" /> : null}
        {title ? (
          <Typography
            variant="h6"
            className={classnames(classes.title, titleOnly && classes.only)}
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

const Paragraph = ({ className, children }: ParagraphProps) => {
  const classes = useStyles();
  return (
    <Typography className={classnames(classes.paragraph, className)}>
      {children}
    </Typography>
  );
};

ToggleCard.Paragraph = Paragraph;

export default ToggleCard;

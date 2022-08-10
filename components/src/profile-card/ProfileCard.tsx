import React, { MutableRefObject } from "react";
import { SVGImport } from "@bmi-digital/svg-import";
import { Avatar } from "@material-ui/core";
import classnames from "classnames";
import AnchorLink from "../anchor-link/AnchorLink";
import { ClickableAction } from "../clickable/Clickable";
import Typography from "../typography/Typography";
import styles from "./ProfileCard.module.scss";

type Props = {
  imageSource?: string | React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  body?: React.ReactNode;
};

type BodyProps = {
  name: React.ReactNode;
  title?: React.ReactNode;
  style?: any;
};

const Body = (
  { name, title, style }: BodyProps,
  ref:
    | ((instance: HTMLDivElement | null) => void)
    | MutableRefObject<HTMLDivElement | null>
    | null
) => {
  return (
    <div className={styles["body"]} style={style}>
      <div ref={ref}>
        <Typography variant="h5" component="strong">
          {name}
        </Typography>
        {title && (
          <Typography className={styles["title"]} variant="body2">
            {title}
          </Typography>
        )}
      </div>
    </div>
  );
};

const ProfileCard = ({ imageSource, children, className, body }: Props) => {
  const hasFooter = Array.isArray(children) ? children.length > 0 : children;

  return (
    <div className={classnames(styles["ProfileCard"], className)}>
      <div className={styles["head"]}>
        <Avatar
          className={styles["profile-picture"]}
          src={typeof imageSource === "string" ? imageSource : undefined}
        >
          {typeof imageSource !== "string" && imageSource}
        </Avatar>
      </div>
      {body}
      {hasFooter && <div className={styles["footer"]}>{children}</div>}
    </div>
  );
};

type RowProps = {
  children: React.ReactNode;
  action?: ClickableAction;
  icon?: SVGImport;
  anchorComponent?: React.ElementType;
};

const ProfileRow = ({
  children,
  action,
  icon: Icon,
  anchorComponent: AnchorLinkComponent = AnchorLink
}: RowProps) => {
  return (
    <span className={styles["row"]}>
      {Icon ? <Icon className={styles["row-icon"]} /> : null}
      {action ? (
        <AnchorLinkComponent action={action}>{children}</AnchorLinkComponent>
      ) : (
        children
      )}
    </span>
  );
};

ProfileCard.Row = ProfileRow;
ProfileCard.Body = React.forwardRef(Body);

export default ProfileCard;
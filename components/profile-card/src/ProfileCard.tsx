import React, { MutableRefObject } from "react";
import Typography from "@bmi/typography";
import AnchorLink, { ClickableAction } from "@bmi/anchor-link";
import classnames from "classnames";
import styles from "./ProfileCard.module.scss";

type Props = {
  imageSource: string;
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
        <img className={styles["profile-picture"]} src={imageSource} />
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
};

const ProfileRow = ({ children, action, icon: Icon }: RowProps) => {
  return (
    <span className={styles["row"]}>
      {Icon ? <Icon className={styles["row-icon"]} /> : null}
      {action ? <AnchorLink action={action}>{children}</AnchorLink> : children}
    </span>
  );
};

ProfileCard.Row = ProfileRow;
ProfileCard.Body = React.forwardRef(Body);

export default ProfileCard;
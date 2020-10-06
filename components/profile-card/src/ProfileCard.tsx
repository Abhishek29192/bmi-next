import React from "react";
import Typography from "@bmi/typography";
import AnchorLink, { ClickableAction } from "@bmi/anchor-link";
import styles from "./ProfileCard.module.scss";
import classnames from "classnames";

type Props = {
  name: React.ReactNode;
  title?: React.ReactNode;
  imageSource: string;
  children?: React.ReactNode;
  className?: string;
};

const ProfileCard = ({
  name,
  title,
  imageSource,
  children,
  className
}: Props) => {
  const hasFooter = Array.isArray(children) ? children.length > 0 : children;

  return (
    <div className={classnames(styles["ProfileCard"], className)}>
      <div className={styles["head"]}>
        <img className={styles["profile-picture"]} src={imageSource} />
      </div>
      <div className={styles["body"]}>
        <Typography variant="h5" component="strong">
          {name}
        </Typography>
        {title && (
          <Typography className={styles["title"]} variant="body2">
            {title}
          </Typography>
        )}
      </div>
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

export default ProfileCard;

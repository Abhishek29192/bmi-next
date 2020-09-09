import React from "react";
import Typography from "@bmi/typography";
import AnchorLink, { ClickableAction } from "@bmi/anchor-link";
import styles from "./ProfileCard.module.scss";

type Props = {
  name: React.ReactNode;
  title?: React.ReactNode;
  imageSource: string;
  children?: React.ReactNode;
};

const ProfileCard = ({ name, title, imageSource, children }: Props) => {
  return (
    <div className={styles["ProfileCard"]}>
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
      {children && <div className={styles["footer"]}>{children}</div>}
    </div>
  );
};

type RowProps = {
  children: React.ReactNode;
  action?: ClickableAction;
  icon: SVGImport;
};

const ProfileRow = ({ children, action, icon: Icon }: RowProps) => {
  return (
    <span className={styles["row"]}>
      <Icon className={styles["row-icon"]} />
      {action ? <AnchorLink action={action}>{children}</AnchorLink> : children}
    </span>
  );
};

ProfileCard.Row = ProfileRow;

export default ProfileCard;

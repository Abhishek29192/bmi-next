import classnames from "classnames";
import React from "react";
import Typography from "../typography/Typography";
import styles from "./Bullets.module.scss";

const Bullets = ({ className, ...rest }: React.HTMLProps<HTMLUListElement>) => {
  return <ul className={classnames(styles["Bullets"], className)} {...rest} />;
};

const Bullet = ({
  className,
  children
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <Typography
      variant="body1"
      component="li"
      className={classnames(styles["li"], className)}
    >
      {children}
    </Typography>
  );
};

Bullets.Item = Bullet;

export default Bullets;

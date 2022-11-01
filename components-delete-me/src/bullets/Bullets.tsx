import classnames from "classnames";
import React from "react";
import Typography from "../typography";
import { useStyles } from "./styles";

const Bullets = ({ className, ...rest }: React.HTMLProps<HTMLUListElement>) => {
  const classes = useStyles();
  return <ul className={classnames(classes.root, className)} {...rest} />;
};

const Bullet = ({
  className,
  children
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  const classes = useStyles();
  return (
    <Typography
      variant="body1"
      component="li"
      className={classnames(classes.li, className)}
    >
      {children}
    </Typography>
  );
};

Bullets.Item = Bullet;

export default Bullets;

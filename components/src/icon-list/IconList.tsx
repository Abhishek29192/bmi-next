import { ChevronRight } from "@material-ui/icons";
import classnames from "classnames";
import React from "react";
import Typography from "../typography/Typography";
import { useStyles } from "./styles";

type ListItemProps = {
  icon?: React.ReactNode;
  title: string;
  children?: React.ReactNode;
  component?: React.ElementType;
  isCompact?: boolean;
};

const ListItem = ({
  icon,
  title,
  children,
  component,
  isCompact
}: ListItemProps) => {
  const classes = useStyles();
  return (
    <li
      className={classnames(classes.listItem, isCompact && classes.isCompact)}
    >
      <div className={classes.icon}>{icon || <ChevronRight />}</div>
      <div className={classes.content}>
        <Typography component={component} variant={isCompact ? "body1" : "h6"}>
          {title}
        </Typography>
        {children && <span className={classes.description}>{children}</span>}
      </div>
    </li>
  );
};

type Props = {
  children:
    | React.ReactElement<ListItemProps>
    | React.ReactElement<ListItemProps>[];
};

const IconList = ({ children }: Props) => {
  const classes = useStyles();
  return <ul className={classes.root}>{children}</ul>;
};

IconList.Item = ListItem;

export default IconList;

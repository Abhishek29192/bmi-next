import { SVGImport } from "@bmi-digital/svg-import";
import classnames from "classnames";
import React from "react";
import Icon from "../icon";
import Typography from "../typography/Typography";
import { useStyles } from "./styles";

type Props = {
  icon: SVGImport;
  title: string;
  children?: React.ReactNode;
  error?: boolean;
};
const ResponseMessage = ({ icon, title, children, error }: Props) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Icon
        className={classnames(classes.icon, error && classes.error)}
        source={icon}
      />
      <Typography className={classes.title} variant="h2">
        {title}
      </Typography>
      {children}
    </div>
  );
};

export default ResponseMessage;

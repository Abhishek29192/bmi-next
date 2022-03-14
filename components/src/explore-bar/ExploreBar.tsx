import React from "react";
import Button from "../button/Button";
import { ClickableAction } from "../clickable/Clickable";
import Typography from "../typography/Typography";
import { useStyles } from "./styles";

type Link = {
  label: React.ReactNode;
  action?: ClickableAction;
};

type Props = {
  heading: React.ReactNode;
  links: readonly Link[];
};

const ExploreBar = ({ heading, links }: Props) => {
  const classes = useStyles();

  return (
    <nav className={classes.root} aria-labelledby="explore-bar">
      <Typography
        id="explore-bar"
        variant="h6"
        component="h2"
        className={classes.heading}
      >
        {heading}
      </Typography>
      {links.map(({ label, action }, key) => (
        <Button
          key={`link-${key}`}
          className={classes.link}
          variant="opaqueOutlined"
          action={action}
        >
          {label}
        </Button>
      ))}
    </nav>
  );
};

export default ExploreBar;

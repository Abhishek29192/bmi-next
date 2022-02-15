import React from "react";
import { Button, ClickableAction } from "@bmi-digital/components";
import { Typography } from "@bmi-digital/components";
import styles from "./ExploreBar.module.scss";

type Link = {
  label: React.ReactNode;
  action?: ClickableAction;
};

type Props = {
  heading: React.ReactNode;
  links: readonly Link[];
};

const ExploreBar = ({ heading, links }: Props) => {
  return (
    <nav className={styles["ExploreBar"]} aria-labelledby="explore-bar">
      <Typography
        id="explore-bar"
        variant="h6"
        component="h2"
        className={styles["heading"]}
      >
        {heading}
      </Typography>
      {links.map(({ label, action }, key) => (
        <Button
          key={`link-${key}`}
          className={styles["link"]}
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

import React from "react";
import Button, { ClickableAction } from "@bmi/button";
import Typography from "@bmi/typography";
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
          variant="outlined"
          action={action}
        >
          {label}
        </Button>
      ))}
    </nav>
  );
};

export default ExploreBar;
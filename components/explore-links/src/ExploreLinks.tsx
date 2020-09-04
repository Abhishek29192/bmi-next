import React from "react";
import Button, { ClickableAction } from "@bmi/button";
import Typography from "@bmi/typography";
import styles from "./ExploreLinks.module.scss";

type Link = {
  label: React.ReactNode;
  action?: ClickableAction;
};

type Props = {
  heading: React.ReactNode;
  links: readonly [Link, ...Link[]];
};

const ExploreLinks = ({ heading, links }: Props) => {
  return (
    <nav className={styles["ExploreLinks"]} aria-labelledby="explore-links">
      <Typography
        id="explore-links"
        variant="h6"
        // @ts-ignore Accepts component property although not reflected in TS
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

export default ExploreLinks;

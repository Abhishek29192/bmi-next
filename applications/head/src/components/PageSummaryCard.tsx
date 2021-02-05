import React from "react";
import Typography from "@bmi/typography";
import { Link } from "gatsby";
import AnchorLink from "@bmi/anchor-link";
import styles from "./styles/PageSummaryCard.module.scss";

type Props = {
  title: string;
  subtitle: string;
  countryCode: string;
  slug: string;
};

const PageSummaryCard = ({ title, subtitle, countryCode, slug }: Props) => (
  <div className={styles["PageSummaryCard"]}>
    <AnchorLink
      action={{
        model: "routerLink",
        linkComponent: Link,
        href: `/${countryCode}/${slug}`
      }}
    >
      <Typography variant="h4">{title}</Typography>
    </AnchorLink>
    <Typography variant="lead" className={styles["description"]}>
      {subtitle}
    </Typography>
  </div>
);

export default PageSummaryCard;

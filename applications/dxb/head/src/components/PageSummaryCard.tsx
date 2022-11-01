import { AnchorLink, Typography } from "@bmi-digital/components";
import React from "react";
import { getClickableActionFromUrl } from "./Link";
import styles from "./styles/PageSummaryCard.module.scss";

type Props = {
  title: string;
  subtitle: string;
  countryCode: string;
  path: string;
};

const PageSummaryCard = ({ title, subtitle, countryCode, path }: Props) => (
  <div className={styles["PageSummaryCard"]}>
    <AnchorLink
      action={getClickableActionFromUrl(
        { path },
        null,
        countryCode,
        null,
        title
      )}
    >
      <Typography noClamp variant="h4">
        {title}
      </Typography>
    </AnchorLink>
    <Typography variant="lead" className={styles["description"]}>
      {subtitle}
    </Typography>
  </div>
);

export default PageSummaryCard;

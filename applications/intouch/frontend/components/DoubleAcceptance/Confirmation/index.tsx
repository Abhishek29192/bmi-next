import React from "react";
import { useTranslation } from "next-i18next";
import { Typography, Grid } from "@bmi/components";
import styles from "../styles.module.scss";
import { useMarketContext } from "../../../context/MarketContext";

const Confirmation = () => {
  const { t } = useTranslation("double-acceptance");
  const { market } = useMarketContext();
  const website = `<a href="https://www.bmigroup.com/${market}">www.bmigroup.com/${market}</a>`;

  return (
    <div className={styles.container}>
      <Typography variant="h4" hasUnderline>
        {t("confirmation.title")}
      </Typography>
      <div className={styles.body}>
        <Grid container>
          {t<string, string[]>("confirmation.description", {
            returnObjects: true,
            interpolation: { escapeValue: false },
            website
          }).map((description, id) => (
            <Grid item xs={12} key={`double-acceptance-description-${id}`}>
              <span dangerouslySetInnerHTML={{ __html: description }} />
            </Grid>
          ))}
        </Grid>
      </div>
    </div>
  );
};

export default Confirmation;

import { Grid, Typography } from "@bmi-digital/components";
import { useTranslation } from "next-i18next";
import React from "react";
import { useMarketContext } from "../../../context/MarketContext";
import styles from "../styles.module.scss";

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
        <Grid nonce={undefined} container>
          {t<string, string[]>("confirmation.description", {
            returnObjects: true,
            interpolation: { escapeValue: false },
            website
          }).map((description, id) => (
            <Grid
              nonce={undefined}
              item
              xs={12}
              key={`double-acceptance-description-${id}`}
            >
              <span dangerouslySetInnerHTML={{ __html: description }} />
            </Grid>
          ))}
        </Grid>
      </div>
    </div>
  );
};

export default Confirmation;

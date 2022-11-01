import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography
} from "@bmi-digital/components";
import { useTranslation } from "next-i18next";
import React, { useState } from "react";
import { RegisterCompanyDialog } from "../Dialog";
import styles from "./styles.module.scss";

type Props = {
  mapsApiKey: string;
};
export const RegisterCompanyCard = ({ mapsApiKey }: Props) => {
  const { t } = useTranslation("profile");
  const [isDialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Card className={styles.main}>
        <CardContent>
          <Typography variant="h5" className={styles.heading}>
            {t("registerCompany.heading")}
          </Typography>
          <Typography>{t("registerCompany.body")}</Typography>
        </CardContent>
        <CardActions>
          <Button variant="outlined" onClick={() => setDialogOpen(true)}>
            {t("registerCompany.cta")}
          </Button>
        </CardActions>
      </Card>
      <RegisterCompanyDialog
        mapsApiKey={mapsApiKey}
        isOpen={isDialogOpen}
        onCloseClick={() => setDialogOpen(false)}
      />
    </>
  );
};

import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import Card, { CardContent, CardActions } from "@bmi/card";
import Typography from "@bmi/typography";
import Button from "@bmi/button";
import { RegisterCompanyDialog } from "../../Pages/Company/EditCompany/DialogRegister";
import styles from "./styles.module.scss";

const RegisterCompanyCard = () => {
  const { t } = useTranslation("profile-page");
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
        isOpen={isDialogOpen}
        onCloseClick={() => setDialogOpen(false)}
      />
    </>
  );
};

export default RegisterCompanyCard;

import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "next-i18next";
import { Dialog } from "@bmi-digital/components";
import { Typography } from "@bmi-digital/components";
import { useIdleTimer } from "react-idle-timer";
import { Warning } from "@material-ui/icons";
import styles from "./styles.module.scss";

type Props = {
  showAfter: number;
  waitFor: number;
};

const LogoutPopup = ({ showAfter, waitFor }: Props) => {
  const timeout = useRef(null);
  const { t } = useTranslation();
  const [counter, setCounter] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    counter > 0 &&
      setTimeout(() => {
        setCounter(counter - 1000);
      }, 1000);
  }, [counter]);

  const handleOnIdle = () => {
    setDialogOpen(true);

    setCounter(waitFor);

    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      window.location.assign("/api/auth/logout");
    }, waitFor);
  };

  useIdleTimer({
    timeout: showAfter,
    onIdle: handleOnIdle
  });

  const onCancel = () => {
    clearTimeout(timeout.current);
    window.location.assign("/api/auth/logout");
  };
  const onContinue = () => {
    clearTimeout(timeout.current);
    setDialogOpen(false);
  };

  return (
    <Dialog onCloseClick={onContinue} open={dialogOpen}>
      <Dialog.Title variant="h5">
        <div className={styles.logoutPopupTitle}>
          <Warning className={styles.logoutIcon} />
          {t("session.dialog.title", {
            counter: new Date(counter).toISOString().substr(14, 5)
          })}
        </div>
      </Dialog.Title>
      <Dialog.Content>
        <Typography>{t("session.dialog.content")}</Typography>
      </Dialog.Content>
      <Dialog.Actions
        cancelLabel={t("session.dialog.logout")}
        onCancelClick={onCancel}
        confirmLabel={t("session.dialog.continue")}
        onConfirmClick={onContinue}
      />
    </Dialog>
  );
};

export default LogoutPopup;

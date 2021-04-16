import React from "react";
import Drawer from "@material-ui/core/Drawer";
import Typography from "@bmi/typography";
import { useTranslation } from "next-i18next";
import { Close } from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@bmi/icon";
import Button from "@bmi/button";
import styles from "./styles.module.scss";

export type NotificationsPanelProps = {
  open: boolean;
  children: React.ReactNode | React.ReactNode[];
};

export const NotificationsPanel = ({
  open,
  children
}: NotificationsPanelProps) => {
  const { t } = useTranslation("common");
  return (
    <Drawer variant="persistent" anchor="right" open={open}>
      <div className={styles.drawer}>
        <div className={styles.header}>
          <Typography variant="h5">{t("Notifications")}</Typography>
          <IconButton>
            <Icon source={Close} style={{ fontSize: 24 }} />
          </IconButton>
        </div>
        <div className={styles.container}>
          <div className={styles.containerHead}>
            <Typography variant="subtitle1">{t("Today")}</Typography>
            <Button variant="text">{t("Mark all as read")}</Button>
          </div>
          {children}
        </div>
      </div>
    </Drawer>
  );
};

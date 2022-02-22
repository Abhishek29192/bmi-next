import React from "react";
import { useTranslation } from "next-i18next";
import { Notification as NotificationType } from "@bmi/intouch-api-types";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import isToday from "dayjs/plugin/isToday";
import { Typography } from "@bmi/components";
import { Notification } from "../Notification";
import styles from "./styles.module.scss";

type Notification = Pick<NotificationType, "id" | "body" | "sendDate" | "read">;

export type NotificationsPanelProps = {
  notifications?: ReadonlyArray<Notification>;
};

type NotificationsSetProps = {
  notifications?: ReadonlyArray<Notification>;
  title: string;
};

dayjs.extend(isBetween);
dayjs.extend(isToday);

function sortNotifications(notifications) {
  const today = [];
  const earlier = [];
  const older = [];

  notifications.forEach(function (notification) {
    if (
      dayjs(notification.sendDate).isBetween(
        dayjs().subtract(2, "month"),
        dayjs(),
        "day"
      )
    ) {
      earlier.push(notification);
    } else if (dayjs(notification.sendDate).isToday()) {
      today.push(notification);
    } else {
      older.push(notification);
    }
  });

  return {
    today,
    earlier,
    older
  };
}

const NotificationsSet = ({ notifications, title }: NotificationsSetProps) => {
  if (notifications.length) {
    return (
      <div className={styles.set}>
        <Typography variant="h5" className={styles.subheading}>
          {title}
        </Typography>
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            message={notification.body}
            date={notification.sendDate}
            read={notification.read}
            id={notification.id}
          />
        ))}
      </div>
    );
  } else {
    return null;
  }
};

export const NotificationsPanel = ({
  notifications
}: NotificationsPanelProps) => {
  const { t } = useTranslation("common");

  const { today, earlier, older } = React.useMemo(
    () => sortNotifications(notifications),
    [notifications]
  );

  return (
    <div className={styles.main}>
      <NotificationsSet
        notifications={today}
        title={t("notifications.today")}
      />
      <NotificationsSet
        notifications={earlier}
        title={t("notifications.earlier")}
      />
      <NotificationsSet
        notifications={older}
        title={t("notifications.older")}
      />
    </div>
  );
};

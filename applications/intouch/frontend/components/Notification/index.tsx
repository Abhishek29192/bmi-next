import React from "react";
import Typography from "@bmi/typography";
import TimeAgo from "javascript-time-ago";
import { useTranslation } from "next-i18next";
import ReactTimeAgo from "react-time-ago";
import en from "javascript-time-ago/locale/en";
import it from "javascript-time-ago/locale/it";
import nb from "javascript-time-ago/locale/nb";
import dynamic from "next/dynamic";
import { Link } from "../Link";
import styles from "./styles.module.scss";

TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(it);
TimeAgo.addLocale(nb);

export type NotificationProps = {
  message: string;
  date: string;
  read: boolean;
  id: number;
};

const ReactMarkdown = dynamic(
  () => import("react-markdown").then((module) => module.default),
  { ssr: false }
);

export const Notification = ({
  message,
  date,
  read,
  id
}: NotificationProps) => {
  const { i18n } = useTranslation();
  return (
    <div className={`${styles.main} ${read ? null : styles.unread}`}>
      <Typography variant="body1" component="div" className={styles.body}>
        <div className={styles.timeAgo}>
          <ReactTimeAgo date={date} locale={i18n.language.replace("_", "-")} />
        </div>
        <div>
          <ReactMarkdown
            components={{
              a({ children, href }: { children: string; href: string }) {
                return (
                  <Link href={href}>
                    <a>{children}</a>
                  </Link>
                );
              }
            }}
          >
            {message}
          </ReactMarkdown>
        </div>
      </Typography>
    </div>
  );
};

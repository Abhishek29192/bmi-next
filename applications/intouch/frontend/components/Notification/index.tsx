/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React from "react";
import { Typography } from "@bmi/components";
import { useTranslation } from "next-i18next";
import ReactTimeAgo from "react-time-ago";
import classnames from "classnames";
import ReactMarkdown from "react-markdown";
import { Link } from "../Link";
import styles from "./styles.module.scss";
import "../../lib/reactTimeAgo";

export type NotificationProps = {
  message: string;
  date: string;
  read: boolean;
};

export const Notification = ({
  // eslint-disable-next-line react/prop-types
  message,
  // eslint-disable-next-line react/prop-types
  date,
  // eslint-disable-next-line react/prop-types
  read
}: NotificationProps) => {
  const { i18n } = useTranslation();
  return (
    <div className={classnames(styles.main, { [styles.unread]: !read })}>
      <Typography variant="body1" component="div" className={styles.body}>
        <div className={styles.timeAgo}>
          <ReactTimeAgo
            date={Date.parse(date)}
            locale={i18n.language.replace("_", "-")}
          />
        </div>
        <div>
          <ReactMarkdown
            components={{
              a({
                children,
                href
              }: {
                children?: React.ReactNode;
                href?: string;
              }) {
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

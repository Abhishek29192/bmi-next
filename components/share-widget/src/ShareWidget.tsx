import Button from "@bmi/button";
import Icon from "@bmi/icon";
import Typography from "@bmi/typography";
import { Tooltip } from "@material-ui/core";
import {
  Email,
  Facebook,
  FileCopyOutlined,
  LinkedIn,
  Pinterest,
  Twitter
} from "@material-ui/icons";
import classnames from "classnames";
import React, { MouseEvent, useEffect, useState } from "react";
import styles from "./ShareWidget.module.scss";

const iconMap = {
  copy: FileCopyOutlined,
  facebook: Facebook,
  linkedin: LinkedIn,
  twitter: Twitter,
  pinterest: Pinterest,
  email: Email
};

type Channel =
  | {
      type: "email" | "facebook" | "linkedin" | "pinterest" | "twitter";
      label: string;
      apiUrl: string;
    }
  | {
      type: "copy";
      label: string;
    };

type Props = {
  channels: Channel[];
  clipboardSuccessMessage?: string;
  clipboardErrorMessage?: string;
  isLeftAligned?: boolean;
  label?: React.ReactNode;
  // message?: string; // @todo: Not all have APIs for this
};

const ShareWidget = ({
  channels,
  clipboardSuccessMessage = "Copied to clipboard",
  clipboardErrorMessage = "There was an error copying to clipboard",
  isLeftAligned = false,
  label = "Share this"
}: Props) => {
  const [tooltipTitle, setTooltipTitle] = useState<string>("");
  const [tooltipOpen, setTooltipOpen] = useState<boolean>(false);

  useEffect(() => {
    let openTooltipTimeout: NodeJS.Timeout;

    if (tooltipOpen) {
      openTooltipTimeout = setTimeout(() => setTooltipOpen(false), 2000);
    }

    return () => clearTimeout(openTooltipTimeout);
  }, [tooltipOpen]);

  const handleClick = async (
    _: MouseEvent<HTMLButtonElement>,
    channel: Channel
  ) => {
    switch (channel.type) {
      case "copy":
        try {
          await navigator.clipboard.writeText(location.href);
          setTooltipTitle(clipboardSuccessMessage);
        } catch (error) {
          setTooltipTitle(clipboardErrorMessage);
        }
        setTooltipOpen(true);
        break;
      case "email": // @todo: Use service in future.
        location.href = `${channel.apiUrl}${location.href}`;
        break;
      default:
        open(
          `${channel.apiUrl}${location.href}`,
          "Share",
          "height=400,width=555"
        );
    }
  };

  return (
    <div
      className={classnames(styles["ShareWidget"], {
        [styles["ShareWidget--left-aligned"]]: isLeftAligned
      })}
    >
      <Typography className={styles["label"]} variant="h6">
        {label}:
      </Typography>
      <ul className={styles["icon-list"]}>
        {channels.map((channel, key) => (
          <li key={key}>
            <Button
              isIconButton
              variant="text"
              accessibilityLabel={channel.label}
              onClick={(event: MouseEvent<HTMLButtonElement>) =>
                handleClick(event, channel)
              }
            >
              <Icon className={styles["icon"]} source={iconMap[channel.type]} />
            </Button>
            {channel.type === "copy" && (
              <Tooltip title={tooltipTitle} open={tooltipOpen}>
                <div />
              </Tooltip>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ShareWidget;

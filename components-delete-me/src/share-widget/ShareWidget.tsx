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
import DefaultButton from "../button/Button";
import Icon from "../icon";
import Typography from "../typography/Typography";
import { useStyles } from "./styles";

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
  buttonComponent?: React.ComponentType<any>; // TODO
  channels: Channel[];
  clipboardSuccessMessage?: string;
  clipboardErrorMessage?: string;
  isLeftAligned?: boolean;
  title?: React.ReactNode;
  message?: string;
};

const ShareWidget = ({
  buttonComponent,
  channels,
  clipboardSuccessMessage = "Copied to clipboard",
  clipboardErrorMessage = "There was an error copying to clipboard",
  isLeftAligned = false,
  title,
  message
}: Props) => {
  const [tooltipTitle, setTooltipTitle] = useState<string>("");
  const [tooltipOpen, setTooltipOpen] = useState<boolean>(false);

  const classes = useStyles();

  const Button = buttonComponent || DefaultButton;

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
    const REPLACE_REGEX = /{{(href|message)}}/g;

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
        location.href = channel.apiUrl.replace(REPLACE_REGEX, replaceApiString);
        break;
      default:
        open(
          channel.apiUrl.replace(REPLACE_REGEX, replaceApiString),
          "Share",
          "height=400,width=555"
        );
    }
  };

  const replaceApiString = (replacement: string) => {
    switch (replacement) {
      case "{{href}}":
        return location.href;
      case "{{message}}":
      default:
        return message || "";
    }
  };

  return (
    <div
      className={classnames(
        classes.root,
        isLeftAligned && classes.leftAligned,
        isLeftAligned && "test-shareWidget-left-aligned"
      )}
    >
      <Typography className={classes.title} variant="h6">
        {title || "Share this"}:
      </Typography>
      <ul className={classes.iconList}>
        {channels.map((channel, key) => (
          <li key={key}>
            <Button
              isIconButton
              variant="text"
              className={classes.iconButton}
              data-channel={channel.type}
              accessibilityLabel={channel.label}
              onClick={(event: MouseEvent<HTMLButtonElement>) =>
                handleClick(event, channel)
              }
            >
              <Icon className={classes.icon} source={iconMap[channel.type]} />
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

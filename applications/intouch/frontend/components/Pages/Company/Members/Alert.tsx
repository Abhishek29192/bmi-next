import {
  AlertBanner,
  Button,
  Cross as IconCross
} from "@bmi-digital/components";
import { useTranslation } from "next-i18next";
import React from "react";
import { MessageProp } from "./";

type Props = {
  messages: MessageProp[];
  onClose: () => any;
};

const Alert = ({ messages, onClose }: Props) => {
  const { t } = useTranslation("team-page");
  return (
    <>
      {messages?.map((message, index) => (
        <AlertBanner
          key={`message-${index}`}
          severity={message.severity}
          actions={
            <div>
              <Button
                data-testid="CloseButton"
                isIconButton
                variant="text"
                accessibilityLabel={t("remove_user.error")}
                onClick={onClose}
              >
                <IconCross style={{ width: 24, height: 24 }} />
              </Button>
            </div>
          }
        >
          <AlertBanner.Title>{t(message.message)}</AlertBanner.Title>
        </AlertBanner>
      ))}
    </>
  );
};

export default Alert;

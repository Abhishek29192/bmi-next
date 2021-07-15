import React from "react";
import { useTranslation } from "next-i18next";
import AlertBanner from "@bmi/alert-banner";
import Button from "@bmi/button";
import { Cross as IconCross } from "@bmi/icon";
import { MessageProp } from "./";

type Props = {
  messages: MessageProp[];
  onClose: () => any;
};

const Alert = ({ messages, onClose }: Props) => {
  const { t } = useTranslation();

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
          <AlertBanner.Title>{message.message}</AlertBanner.Title>
        </AlertBanner>
      ))}
    </>
  );
};

export default Alert;

import { Button, Dialog } from "@bmi/components";
import { graphql } from "gatsby";
import React from "react";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import { ErrorOutlineOutlined } from "@material-ui/icons";
import RichText, { RichTextData } from "./RichText";

import styles from "./styles/IEDialog.module.scss";

export type Data = {
  ieDialogTitle: string | null;
  ieDialogBody: RichTextData | null;
  ieDialogActionLabel: string | null;
  ieDialogActionLink: string | null;
};

export const IEDialog = ({
  data,
  children
}: {
  data: Data;
  children: React.ReactNode;
}) => {
  const detectIE = () => {
    const userAgent =
      typeof window !== "undefined" ? window.navigator.userAgent : "";

    return userAgent.indexOf("MSIE") > 0 || userAgent.indexOf("Trident") > 0;
  };

  if (!detectIE()) {
    return <>{children}</>;
  }

  return (
    <div className={styles["IEDialog-wrapper"]}>
      <div className={styles["IEDialog"]}>
        <Dialog.Title hasUnderline className={styles["IEDialog-title"]}>
          <ErrorOutlineOutlined className={styles["IEDialog-icon"]} />
          {data.ieDialogTitle}
        </Dialog.Title>
        <Dialog.Content className={styles["IEDialog-body"]}>
          <RichText document={data.ieDialogBody} />
        </Dialog.Content>

        <div className={styles["IEDialog-actions"]}>
          <Button
            action={{
              model: "htmlLink",
              href: data.ieDialogActionLink,
              target: "_blank",
              rel: "noopener noreferrer"
            }}
            endIcon={<ArrowForwardIcon />}
          >
            {data.ieDialogActionLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default IEDialog;

export const query = graphql`
  fragment IEDialogFragment on ContentfulResources {
    ieDialogTitle
    ieDialogActionLabel
    ieDialogActionLink
    ieDialogBody {
      ...RichTextFragment
    }
  }
`;

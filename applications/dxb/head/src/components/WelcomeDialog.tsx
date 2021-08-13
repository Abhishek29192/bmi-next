import React from "react";
import { graphql } from "gatsby";
import Dialog from "@bmi/dialog";
import classnames from "classnames";
import useStickyState from "../utils/sticky-state";
import RichText, { RichTextData } from "./RichText";
import { useSiteContext } from "./Site";
import BrandLogo from "./BrandLogo";
import styles from "./styles/WelcomeDialog.module.scss";

export type Data = {
  welcomeDialogTitle: string | null;
  welcomeDialogBody: RichTextData | null;
  welcomeDialogBrands: string[] | null;
};

const WelcomeDialog = ({ data }: { data: Data }) => {
  const { welcomeDialogTitle, welcomeDialogBody, welcomeDialogBrands } = data;
  if (!welcomeDialogTitle || !welcomeDialogBody) {
    return null;
  }
  const [dialogClose, setDialogClose] = useStickyState(false, "welcome-dialog");
  const { getMicroCopy } = useSiteContext();
  return (
    <Dialog
      open={!dialogClose}
      onCloseClick={() => {
        setDialogClose(true);
      }}
      className={styles["WelcomeDialog"]}
    >
      <Dialog.Title hasUnderline>{welcomeDialogTitle}</Dialog.Title>
      <Dialog.Content>
        <div className={styles["contentArea"]}>
          {welcomeDialogBrands && (
            <div className={styles["brands"]} data-testid="brandsContainer">
              {welcomeDialogBrands.map((brandName, index) => (
                <BrandLogo
                  key={`welcome-brand-${brandName}-${index}`}
                  brandName={brandName}
                  className={styles["brand"]}
                />
              ))}
            </div>
          )}
          <div
            className={classnames(styles["body"], {
              [styles["body--with-brand"]]: welcomeDialogBrands
            })}
          >
            <RichText document={welcomeDialogBody} />
          </div>
        </div>
      </Dialog.Content>
      <Dialog.Actions
        confirmLabel={getMicroCopy("dialog.close")}
        onConfirmClick={() => {
          setDialogClose(true);
        }}
      />
    </Dialog>
  );
};

export default WelcomeDialog;

export const query = graphql`
  fragment WelcomeDialogFragment on ContentfulResources {
    welcomeDialogTitle
    welcomeDialogBrands
    welcomeDialogBody {
      ...RichTextFragment
    }
  }
`;

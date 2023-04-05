import { Dialog } from "@bmi-digital/components";
import { graphql } from "gatsby";
import React from "react";
import { microCopy } from "../constants/microCopies";
import useStickyState from "../utils/sticky-state";
import BrandLogo, { Logo } from "./BrandLogo";
import RichText, { RichTextData } from "./RichText";
import { useSiteContext } from "./Site";
import styles from "./styles/WelcomeDialog.module.scss";

export type Data = {
  welcomeDialogTitle: string | null;
  welcomeDialogBody: RichTextData | null;
  welcomeDialogBrands: Logo[] | null;
};

const WelcomeDialog = ({ data }: { data: Data }) => {
  const { welcomeDialogTitle, welcomeDialogBody, welcomeDialogBrands } = data;

  const [dialogClose, setDialogClose, isMounted] = useStickyState(
    false,
    "welcome-dialog"
  );
  const { getMicroCopy } = useSiteContext();

  const closeDialog = () => {
    setDialogClose(true);
  };

  if (!welcomeDialogTitle || !welcomeDialogBody || !isMounted) {
    return null;
  }

  return (
    <Dialog
      open={!dialogClose}
      onCloseClick={closeDialog}
      className={styles["WelcomeDialog"]}
      data-testid="welcome-dialog"
    >
      <Dialog.Title hasUnderline>{welcomeDialogTitle}</Dialog.Title>
      <Dialog.Content>
        <div className={styles["contentArea"]}>
          {welcomeDialogBrands && (
            <div data-testid="brandsContainer">
              {welcomeDialogBrands.map((brandName, index) => (
                <BrandLogo
                  key={`welcome-brand-${brandName}-${index}`}
                  brandName={brandName}
                  className={styles["brand"]}
                  data-testid={`welcome-brand-${brandName}`}
                />
              ))}
            </div>
          )}
          <div>
            <RichText document={welcomeDialogBody} hasNoBottomMargin />
          </div>
        </div>
      </Dialog.Content>
      <Dialog.Actions
        confirmLabel={getMicroCopy(microCopy.DIALOG_CLOSE)}
        onConfirmClick={closeDialog}
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

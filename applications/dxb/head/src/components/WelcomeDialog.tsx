import Dialog from "@bmi-digital/components/dialog";
import { microCopy } from "@bmi/microcopies";
import React from "react";
import useStickyState from "../utils/sticky-state";
import RichText from "./RichText";
import { useSiteContext } from "./Site";
import {
  StyledBrandLogo,
  StyledContentArea
} from "./styles/WelcomeDialog.styles";
import type { RichTextData } from "./RichText";
import type { Logo } from "./BrandLogo";

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
      data-testid="welcome-dialog"
    >
      <Dialog.Title hasUnderline>{welcomeDialogTitle}</Dialog.Title>
      <Dialog.Content>
        <StyledContentArea>
          {welcomeDialogBrands && (
            <div data-testid="brandsContainer">
              {welcomeDialogBrands.map((brandName, index) => (
                <StyledBrandLogo
                  key={`welcome-brand-${brandName}-${index}`}
                  brandName={brandName}
                  data-testid={`welcome-brand-${brandName}`}
                />
              ))}
            </div>
          )}
          <div>
            <RichText document={welcomeDialogBody} hasNoBottomMargin />
          </div>
        </StyledContentArea>
      </Dialog.Content>
      <Dialog.Actions
        confirmLabel={getMicroCopy(microCopy.DIALOG_CLOSE)}
        onConfirmClick={closeDialog}
      />
    </Dialog>
  );
};

export default WelcomeDialog;

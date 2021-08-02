import React from "react";
import Dialog from "@material-ui/core/Dialog";
import { GetProjectQuery } from "../../../graphql/generated/operations";
import { WizardOverlay } from "../../../components/WizardLayout";

type ApplyGuaranteeDialogProps = {
  isOpen: boolean;
  project: GetProjectQuery["project"];
  onCloseClick: () => void;
};
export const ApplyGuaranteeDialog = ({
  isOpen,
  project,
  onCloseClick
}: ApplyGuaranteeDialogProps) => {
  return (
    isOpen && (
      <Dialog fullScreen open={isOpen} onClose={onCloseClick}>
        <WizardOverlay project={project} onClose={onCloseClick} />
      </Dialog>
    )
  );
};

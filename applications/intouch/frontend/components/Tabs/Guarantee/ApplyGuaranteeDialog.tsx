import React from "react";
import { useTranslation } from "next-i18next";
import Dialog from "@material-ui/core/Dialog";
import { gql } from "@apollo/client";
import { EvidenceItemInput } from "@bmi/intouch-api-types";
import {
  CreateGuaranteeMutationVariables,
  GetProjectQuery
} from "../../../graphql/generated/operations";
import { WizardOverlay } from "../../../components/WizardLayout";
import { GuaranteeWizardData } from "../../../components/WizardLayout/WizardContext";
import {
  GetProjectDocument,
  useCreateGuaranteeMutation
} from "../../../graphql/generated/hooks";

type ApplyGuaranteeDialogProps = {
  isOpen: boolean;
  project: GetProjectQuery["project"];
  onCloseClick: () => void;
  onCompletedClick?: () => void;
};
export const ApplyGuaranteeDialog = ({
  isOpen,
  project,
  onCloseClick,
  onCompletedClick
}: ApplyGuaranteeDialogProps) => {
  const { t } = useTranslation("project-page");

  const [createGuaranteMutation] = useCreateGuaranteeMutation({
    onCompleted: (data) => {
      onCompletedClick && onCompletedClick();
    }
  });

  const onSubmitHandler = ({
    guaranteeType,
    guaranteeTemplate,
    system,
    product,
    evidences
  }: GuaranteeWizardData) => {
    const variables: CreateGuaranteeMutationVariables = {
      input: {
        guarantee: {
          projectId: project.id,
          systemBmiRef: system?.bmiRef,
          productBmiRef: product?.bmiRef,
          guaranteeTypeId: guaranteeType.sys.id,
          guaranteeTemplateId: guaranteeTemplate.sys.id,
          status: "SUBMITTED",
          evidenceItemsUsingId: {
            create: evidences.map((evidence) => ({
              attachmentUpload: evidence
            })) as EvidenceItemInput[]
          }
        }
      }
    };

    createGuaranteMutation({
      variables: variables,
      refetchQueries: [
        {
          query: GetProjectDocument,
          variables: {
            projectId: project.id
          }
        }
      ]
    });
  };

  return (
    <div>
      <Dialog fullScreen open={isOpen} onClose={onCloseClick}>
        <WizardOverlay
          project={project}
          onClose={onCloseClick}
          onSubmit={onSubmitHandler}
        />
      </Dialog>
    </div>
  );
};

export const CREATE_GUARANTEE = gql`
  mutation createGuarantee($input: CreateGuaranteeInput!) {
    createGuarantee(input: $input) {
      guarantee {
        id
      }
    }
  }
`;

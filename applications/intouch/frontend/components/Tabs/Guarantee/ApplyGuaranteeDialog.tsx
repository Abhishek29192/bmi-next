import React from "react";
import Dialog from "@material-ui/core/Dialog";
import { gql } from "@apollo/client";
import {
  GuaranteeCoverage,
  GuaranteeReferenceCode,
  Language
} from "@bmi/intouch-api-types";
import {
  CreateGuaranteeMutationVariables,
  GetProjectQuery
} from "../../../graphql/generated/operations";
import { WizardOverlay } from "../../../components/WizardLayout";
import { GuaranteeWizardData } from "../../../components/WizardLayout/WizardContext";
import {
  GetProjectDocument,
  useCreateGuaranteeMutation,
  useCreateGuaranteePdfMutation
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
  const [createGuaranteMutation] = useCreateGuaranteeMutation({
    onCompleted: ({ createGuarantee }) => {
      if (createGuarantee.guarantee.status === "APPROVED") {
        createGuaranteePdfMutation({
          variables: {
            id: createGuarantee.guarantee.id
          }
        });
      }

      onCompletedClick && onCompletedClick();
    }
  });

  const [createGuaranteePdfMutation] = useCreateGuaranteePdfMutation();

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
          guaranteeReferenceCode:
            guaranteeType.guaranteeReferenceCode as GuaranteeReferenceCode,
          coverage: guaranteeType.coverage as GuaranteeCoverage,
          languageCode:
            guaranteeTemplate.languageCode.toUpperCase() as Language,
          evidenceItemsUsingId: {
            create: evidences.map((evidence) => ({
              name: evidence.name,
              // NOTE: mandatory in DB but resolver updates it with cloud URL
              attachment: "",
              attachmentUpload: evidence
            }))
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
        coverage
        status
      }
    }
  }
`;

export const CREATE_GUARANTEE_PDF = gql`
  mutation createGuaranteePdf($id: Int!) {
    createGuaranteePdf(id: $id) {
      messageId
    }
  }
`;

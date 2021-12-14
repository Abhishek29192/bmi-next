import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import Dialog from "@material-ui/core/Dialog";
import Modal from "@bmi/dialog";
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
import log from "../../../lib/logger";

import {
  GetProjectDocument,
  useCreateGuaranteeMutation,
  useCreateGuaranteePdfMutation
} from "../../../graphql/generated/hooks";

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
  const [createGuaranteMutation] = useCreateGuaranteeMutation({
    onCompleted: ({ createGuarantee }) => {
      const { guarantee } = createGuarantee;
      if (guarantee.status === "APPROVED") {
        createGuaranteePdfMutation({
          variables: {
            id: guarantee.id
          }
        });
      }
      onCloseClick();
      setGuaranteeCoverage(guarantee.coverage);
      setModalOpen(true);
    },
    onError: (error) => {
      setSubmit(false);
      log({
        severity: "ERROR",
        message: `There was an error creating guarantee: ${error.toString()}`
      });
    }
  });
  const [isModalOpen, setModalOpen] = useState(false);
  const [guaranteeCoverage, setGuaranteeCoverage] =
    useState<GuaranteeCoverage>();

  const [isSubmit, setSubmit] = useState<boolean>(false);

  const [createGuaranteePdfMutation] = useCreateGuaranteePdfMutation();

  const onSubmitHandler = async ({
    guaranteeType,
    guaranteeTemplate,
    system,
    product,
    evidences
  }: GuaranteeWizardData) => {
    setSubmit(true);

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
          isSubmit={isSubmit}
        />
      </Dialog>
      <GuaranteeMessage
        isModalOpen={isModalOpen}
        coverage={guaranteeCoverage}
        onCloseClick={() => setModalOpen(false)}
      />
    </div>
  );
};

type GuaranteeMessageProps = {
  isModalOpen: boolean;
  coverage: GuaranteeCoverage;
  onCloseClick: () => void;
};
const GuaranteeMessage = ({
  isModalOpen,
  coverage,
  onCloseClick
}: GuaranteeMessageProps) => {
  const { t } = useTranslation("project-page");
  const dialog = `guarantee_tab.applyGuarantee.${
    coverage !== "SOLUTION" ? "defaultDialog" : "solutionDialog"
  }`;
  return (
    <Modal open={isModalOpen} onCloseClick={onCloseClick}>
      <Modal.Title hasUnderline>{t(`${dialog}.title`)}</Modal.Title>
      <Modal.Content>{t(`${dialog}.description`)}</Modal.Content>
      <Modal.Actions
        confirmLabel={t(`${dialog}.confirm_label`)}
        onConfirmClick={onCloseClick}
      />
    </Modal>
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

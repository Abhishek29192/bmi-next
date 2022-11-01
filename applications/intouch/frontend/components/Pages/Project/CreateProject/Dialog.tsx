import { gql } from "@apollo/client";
import { Dialog } from "@bmi-digital/components";
import {
  ProjectCompanyIdFkeyInput,
  ProjectSiteAddressIdFkeyInput
} from "@bmi/intouch-api-types";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import React, { useCallback } from "react";
import { useAccountContext } from "../../../../context/AccountContext";
import {
  useAddRewardRecordMutation,
  useCreateProjectMutation
} from "../../../../graphql/generated/hooks";
import log from "../../../../lib/logger";
import { spreadObjectKeys } from "../../../../lib/utils/object";
import ProjectForm from "../Form";
import styles from "./styles.module.scss";

export type NewProjectDialogProps = {
  companyId: number;
  isOpen: boolean;
  onCloseClick?: () => void;
  onCompleted?: () => void;
};

export const NewProjectDialog = ({
  companyId,
  isOpen,
  onCloseClick,
  onCompleted
}: NewProjectDialogProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { account } = useAccountContext();

  const [addRewardRecord] = useAddRewardRecordMutation({
    onError: (error) => {
      log({
        severity: "ERROR",
        message: `There was an error adding reward record for action create a project: ${error.toString()}`
      });
    }
  });
  const [createProject, { loading: isSubmitting }] = useCreateProjectMutation({
    onError: (error) => {
      log({
        severity: "ERROR",
        message: `There was an error creating a project: ${error.toString()}`
      });
    },
    onCompleted: async ({ createProject: { project } }) => {
      log({
        severity: "INFO",
        message: `Created project - id: ${project.id}`
      });
      await addRewardRecord({
        variables: {
          input: {
            accountId: account.id,
            rewardCategory: "rc3"
          }
        }
      });
      // Once we can update the cache perhaps we can `shalow: true`
      // at which point closing it makes sense
      onCompleted && onCompleted();
      router.push(`/projects/${project.id}`, undefined, { shallow: false });
    }
  });

  const onSubmit = useCallback((event, values) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    // we need to account for nested objects (e.g. address)
    const valuesObject = spreadObjectKeys(values, (key, value) => {
      if (key === "roofArea") {
        return Number.parseInt(value);
      }

      return value;
    });

    const { siteAddress, ...createProjectValues } = valuesObject;

    const addressToSiteAddressId: ProjectSiteAddressIdFkeyInput = {
      // creates the address and links it to the project
      create: siteAddress
    };

    const companyToCompanyId: ProjectCompanyIdFkeyInput = {
      connectById: {
        id: companyId
      }
    };

    createProject({
      variables: {
        input: {
          project: {
            ...createProjectValues,
            companyToCompanyId,
            addressToSiteAddressId
          }
        }
      }
    });
  }, []);

  return (
    <Dialog
      className={styles.dialog}
      open={isOpen}
      onCloseClick={onCloseClick}
      disablePortal={false}
    >
      <Dialog.Title hasUnderline>
        {t("project-page:addProject.dialog.title")}
      </Dialog.Title>

      <Dialog.Content className={styles.dialogContent}>
        <ProjectForm
          key="project-form"
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
        />
      </Dialog.Content>
    </Dialog>
  );
};

export const CREATE_COMPANY = gql`
  mutation createProject($input: CreateProjectInput!) {
    createProject(input: $input) {
      project {
        ...ProjectDetailsFragment
      }
    }
  }
`;

import React, { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import Button from "@bmi/button";
import Table from "@bmi/table";
import Accordion from "@bmi/accordion";
import Typography from "@bmi/typography";
import { gql } from "@apollo/client";
import {
  EvidenceCategoryType,
  EvidenceItemInput
} from "@bmi/intouch-api-types";
import VisibilityIcon from "@material-ui/icons/Visibility";
import {
  useAddEvidencesMutation,
  GetProjectDocument,
  useContentfulEvidenceCategoriesLazyQuery
} from "../../../graphql/generated/hooks";
import styles from "./styles.module.scss";
import { AddEvidenceDialog, EvidenceCategory } from "./AddEvidenceDialog";

export type UploadsTabProps = {
  projectId: number;
  guaranteeId?: number;
  uploads?: Map<string, string[]>;
  isContentfulEvidenceAvailable?: boolean;
};

export const UploadsTab = ({
  projectId,
  guaranteeId,
  uploads,
  isContentfulEvidenceAvailable
}: UploadsTabProps) => {
  const { t } = useTranslation("project-page");
  const [isEvidenceDialogOpen, setEvidenceDialogOpen] = useState(false);
  const [evidenceCategories, setEvidenceCategories] = useState<
    EvidenceCategory[]
  >([]);

  const [addEvidences] = useAddEvidencesMutation({
    refetchQueries: [
      {
        query: GetProjectDocument,
        variables: {
          projectId
        }
      }
    ]
  });

  const [getEvidenceCategory] = useContentfulEvidenceCategoriesLazyQuery({
    fetchPolicy: "network-only",
    onCompleted: ({ evidenceCategoryCollection }) => {
      const result = evidenceCategoryCollection.items?.map(({ sys, name }) => ({
        id: sys.id,
        name: name
      }));
      setEvidenceCategories(result);
    }
  });

  const evidenceDialogConfirmHandler = async (
    evidenceCategoryType: EvidenceCategoryType,
    customEvidenceCategoryId: string,
    uploadedFiles: File[]
  ) => {
    if (uploadedFiles.length > 0) {
      const evidences = uploadedFiles.map((attachmentUpload) => ({
        projectId,
        guaranteeId,
        attachmentUpload,
        customEvidenceCategoryId,
        evidenceCategoryType,
        // NOTE: mandatory in DB but resolver updates it with cloud URL
        attachment: "",
        name: attachmentUpload.name
      }));
      await addEvidences({
        variables: {
          input: {
            evidences
          }
        }
      });
    }
    setEvidenceDialogOpen(false);
  };

  useEffect(() => {
    if (isContentfulEvidenceAvailable) {
      getEvidenceCategory();
    }
  }, [projectId, isContentfulEvidenceAvailable]);

  return (
    <div className={styles.main}>
      <div className={styles.header}>
        <Button variant="outlined" onClick={() => setEvidenceDialogOpen(true)}>
          {t("upload_tab.header")}
        </Button>
      </div>
      <div className={styles.body}>
        <Accordion>
          {uploads &&
            [...uploads.entries()].map(([key, values]) => {
              return (
                <Accordion.Item key={key} data-testid="uploads-category">
                  <Accordion.Summary>
                    <Typography component="h1" variant="h6">
                      {key}
                    </Typography>
                  </Accordion.Summary>
                  <Accordion.Details>
                    <Table>
                      <Table.Body>
                        {values.map((value, index) => (
                          <Table.Row
                            key={`upload-items-${key}-${index}`}
                            data-testid="uploads-item"
                          >
                            <Table.Cell>{value}</Table.Cell>
                            <Table.Cell>
                              <VisibilityIcon />
                            </Table.Cell>
                          </Table.Row>
                        ))}
                      </Table.Body>
                    </Table>
                  </Accordion.Details>
                </Accordion.Item>
              );
            })}
        </Accordion>
      </div>
      <div>
        <AddEvidenceDialog
          isOpen={isEvidenceDialogOpen}
          evidenceCategories={
            isContentfulEvidenceAvailable ? evidenceCategories : []
          }
          onCloseClick={() => setEvidenceDialogOpen(false)}
          onConfirmClick={evidenceDialogConfirmHandler}
        />
      </div>
    </div>
  );
};

export const ADD_PROJECT_EVIDENCES = gql`
  mutation addEvidences($input: EvidenceItemsAddInput!) {
    evidenceItemsAdd(input: $input) {
      evidenceItems {
        id
        name
      }
    }
  }
`;
export const GET_CONTENTFUL_EVIDENCE_CATEGORIES = gql`
  query contentfulEvidenceCategories {
    evidenceCategoryCollection {
      items {
        sys {
          id
        }
        name
      }
    }
  }
`;

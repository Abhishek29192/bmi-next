import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import Button from "@bmi/button";
import Table from "@bmi/table";
import Accordion from "@bmi/accordion";
import Typography from "@bmi/typography";
import { gql } from "@apollo/client";
import { EvidenceItemInput } from "@bmi/intouch-api-types";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { UploadFile } from "../../../../../../components/upload/src/";
import {
  useAddEvidencesMutation,
  GetProjectDocument
} from "../../../graphql/generated/hooks";
import styles from "./styles.module.scss";
import { AddEvidenceDialog } from "./AddEvidenceDialog";

export type UploadsTabProps = {
  projectId: number;
  uploads?: Map<string, string[]>;
};

export const UploadsTab = ({ projectId, uploads }: UploadsTabProps) => {
  const { t } = useTranslation("project-page");
  const [isEvidenceDialogOpen, setEvidenceDialogOpen] = useState(false);
  const [addEvidences] = useAddEvidencesMutation({
    refetchQueries: [
      {
        query: GetProjectDocument,
        variables: {
          projectId: projectId
        }
      }
    ]
  });
  const evidenceDialogConfirmHandler = async (uploadedFiles: UploadFile[]) => {
    if (uploadedFiles.length > 0) {
      const evidences = uploadedFiles.map(
        (uploadedFile) =>
          ({
            projectId: projectId,
            attachmentUpload: uploadedFile.file,
            evidenceCategoryType: "MISCELLANEOUS"
          } as EvidenceItemInput)
      );
      await addEvidences({
        variables: {
          input: {
            evidences: evidences
          }
        }
      });
    }
    setEvidenceDialogOpen(false);
  };

  return (
    <div className={styles.main}>
      <div className={styles.header}>
        <Button variant="outlined" onClick={() => setEvidenceDialogOpen(true)}>
          {t("uploadTab.header")}
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

import React, { useState } from "react";
import { gql } from "@apollo/client";
import Typography from "@bmi/typography";
import Table from "@bmi/table";
import Button from "@bmi/button";
import Icon, { FilePDF } from "@bmi/icon";
import DeleteIcon from "@material-ui/icons/Delete";
import { useTranslation } from "next-i18next";
import { NoContent } from "../../../NoContent";
import { SimpleCard } from "../../../Cards/SimpleCard";
import AccessControl from "../../../../lib/permissions/AccessControl";
import { CompanyDocumentsFragmentFragment } from "../../../../graphql/generated/operations";
import {
  useAddCompanyDocumentsMutation,
  useDeleteCompanyDocumentMutation
} from "../../../../graphql/generated/hooks";
import { UploadDialog } from "./UploadDialog";
import styles from "./styles.module.scss";

export type CompanyDocumentsProps = {
  companyId: number;
  documents: CompanyDocumentsFragmentFragment["companyDocuments"];
};

export const CompanyDocuments = ({
  companyId,
  documents
}: CompanyDocumentsProps) => {
  const { t } = useTranslation("company-page");
  const [isUploadDialog, setUploadDialog] = useState(false);

  const [companyDocuments, setCompanyDocuments] = useState(documents.nodes);

  const [addCompanyDocuments] = useAddCompanyDocumentsMutation({
    onCompleted: ({ companyDocumentsAdd }) => {
      setCompanyDocuments((prev) => [
        ...prev,
        ...companyDocumentsAdd.companyDocuments
      ]);
    }
  });
  const [deleteCompanyDocumentMutation] = useDeleteCompanyDocumentMutation({
    onCompleted: ({ deleteCompanyDocument }) => {
      setCompanyDocuments((prev) => [
        ...prev.filter((p) => p.id !== deleteCompanyDocument.companyDocument.id)
      ]);
    }
  });

  const uploadDialogConfirmHandler = async (uploadedFiles: File[]) => {
    if (uploadedFiles.length > 0) {
      const documents = uploadedFiles.map((attachmentUpload) => ({
        companyId,
        attachmentUpload,
        document: attachmentUpload.name
      }));
      await addCompanyDocuments({
        variables: {
          input: {
            documents
          }
        }
      });
    }
    setUploadDialog(false);
  };
  const onCompanyDocumentDeletHandler = async (id: number) => {
    deleteCompanyDocumentMutation({
      variables: {
        input: {
          id
        }
      }
    });
  };

  return (
    <div className={styles.main}>
      <SimpleCard>
        <Typography
          variant="h4"
          hasUnderline
          color="primary"
          style={{ fontSize: "1.2rem" }}
        >
          {t("document.title")}
        </Typography>
        <div className={styles.header}>
          <AccessControl dataModel="company" action="addDocument">
            <Button variant="outlined" onClick={() => setUploadDialog(true)}>
              {t("document.addDocument")}
            </Button>
          </AccessControl>
        </div>
        {!companyDocuments.length ? (
          <NoContent message={t("document.noContent")} />
        ) : (
          <div className={styles.body}>
            <Table>
              <Table.Head>
                <Table.Row>
                  <Table.Cell>{t("document.headers.document")}</Table.Cell>
                  <Table.Cell>{t("document.headers.date")}</Table.Cell>
                  <Table.Cell>{t("document.headers.download")}</Table.Cell>
                  <Table.Cell>{t("")}</Table.Cell>
                </Table.Row>
              </Table.Head>
              <Table.Body>
                {companyDocuments.map((doc) => (
                  <Table.Row key={doc.id} style={{ wordBreak: "break-word" }}>
                    <Table.Cell>{doc.document}</Table.Cell>
                    <Table.Cell>
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>
                      <Icon source={FilePDF} className={styles.icon} />
                    </Table.Cell>
                    <Table.Cell>
                      <AccessControl dataModel="company" action="addDocument">
                        <Button
                          variant="text"
                          endIcon={<DeleteIcon color="primary" />}
                          onClick={() => {
                            onCompanyDocumentDeletHandler(doc.id);
                          }}
                        ></Button>
                      </AccessControl>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        )}
      </SimpleCard>

      <UploadDialog
        isOpen={isUploadDialog}
        onCloseClick={() => setUploadDialog(false)}
        onConfirmClick={uploadDialogConfirmHandler}
      />
    </div>
  );
};

export const CompanyDocumentsFragment = gql`
  fragment CompanyDocumentsFragment on Company {
    companyDocuments {
      nodes {
        id
        document
        signedDocumentUrl
        createdAt
        updatedAt
      }
    }
  }
`;

export const ADD_COMPANY_DOCUMENTS = gql`
  mutation addCompanyDocuments($input: CompanyDocumentsAddInput!) {
    companyDocumentsAdd(input: $input) {
      companyDocuments {
        id
        document
        signedDocumentUrl
        createdAt
        updatedAt
      }
    }
  }
`;

export const DELETE_COMPANY_DOCUMENT = gql`
  mutation deleteCompanyDocument($input: DeleteCompanyDocumentInput!) {
    deleteCompanyDocument(input: $input) {
      companyDocument {
        id
        document
        createdAt
      }
    }
  }
`;

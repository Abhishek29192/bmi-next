import { gql } from "@apollo/client";
import {
  Button,
  FileJPEG,
  FileJPG,
  FilePDF,
  FilePNG,
  Icon,
  Table,
  Typography
} from "@bmi-digital/components";
import { CompanyDocumentType } from "@bmi/intouch-api-types";
import DeleteIcon from "@material-ui/icons/Delete";
import { useTranslation } from "next-i18next";
import React, { useEffect, useState } from "react";
import {
  useCreateCompanyDocumentsMutation,
  useDeleteCompanyDocumentMutation
} from "../../../../graphql/generated/hooks";
import { CompanyDocumentsFragmentFragment } from "../../../../graphql/generated/operations";
import log from "../../../../lib/logger";
import { formatFileSize } from "../../../../lib/media/utils";
import AccessControl from "../../../../lib/permissions/AccessControl";
import { formatDate } from "../../../../lib/utils/date";
import { SimpleCard } from "../../../Cards/SimpleCard";
import { NoContent } from "../../../NoContent";
import ConfirmDialog from "./ConfirmDialog";
import styles from "./styles.module.scss";
import { UploadDialog } from "./UploadDialog";

export type CompanyDocumentsProps = {
  companyId: number;
  documents: CompanyDocumentsFragmentFragment["companyDocuments"];
  onCompanyDocumentsUpdate?: () => void;
};

const DOCUMENT_ICONS: {
  [K in CompanyDocumentType]: React.FC<React.SVGProps<SVGSVGElement>>;
} = {
  PDF: FilePDF,
  JPG: FileJPG,
  JPEG: FileJPEG,
  PNG: FilePNG
};

export const CompanyDocuments = ({
  companyId,
  documents,
  onCompanyDocumentsUpdate
}: CompanyDocumentsProps) => {
  const { t } = useTranslation("company-page");
  const [isUploadDialog, setUploadDialog] = useState(false);
  const [mutationError, setMutationError] = useState(null);
  const [confirmDialogState, setConfirmDialogState] = useState({
    isOpen: false,
    id: null
  });

  const [companyDocuments, setCompanyDocuments] = useState<
    CompanyDocumentsFragmentFragment["companyDocuments"]["nodes"]
  >([]);

  useEffect(() => {
    setCompanyDocuments([...documents.nodes]);
  }, [documents]);

  const [createCompanyDocuments, { loading: loadingCreate }] =
    useCreateCompanyDocumentsMutation({
      onError: (error) => {
        log({
          severity: "ERROR",
          message: `There was an error uploading a company document: ${error.toString()}`
        });

        if (error.message === "fileAlreadyExisting") {
          setMutationError(t("document.uploadDialog.fileAlreadyExisting"));
        } else {
          setMutationError(t("document.uploadDialog.genericError"));
        }
      },
      onCompleted: ({ createCompanyDocuments }) => {
        setCompanyDocuments((prev) => [
          ...prev,
          ...createCompanyDocuments.companyDocuments
        ]);
        setUploadDialog(false);
        onCompanyDocumentsUpdate && onCompanyDocumentsUpdate();
      }
    });
  const [deleteCompanyDocumentMutation, { loading: loadingDelete }] =
    useDeleteCompanyDocumentMutation({
      onCompleted: ({ deleteCompanyDocument }) => {
        setCompanyDocuments((prev) => [
          ...prev.filter(
            (p) => p.id !== deleteCompanyDocument.companyDocument.id
          )
        ]);
        setConfirmDialogState({
          id: null,
          isOpen: false
        });
        onCompanyDocumentsUpdate && onCompanyDocumentsUpdate();
      }
    });

  const uploadDialogConfirmHandler = async (uploadedFiles: File[]) => {
    if (uploadedFiles.length > 0) {
      const documents = uploadedFiles.map((attachmentUpload) => ({
        companyId,
        attachmentUpload,
        document: attachmentUpload.name
      }));
      await createCompanyDocuments({
        variables: {
          input: {
            documents
          }
        }
      });
    }
  };
  const onCompanyDocumentDeletHandler = async (id: number) => {
    setConfirmDialogState({
      id,
      isOpen: true
    });
  };
  const onConfirmDialogHandler = async (id: number) => {
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
        <Typography variant="h4" hasUnderline style={{ fontSize: "1.2rem" }}>
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
                  <Table.Row key={doc.id}>
                    <Table.Cell>{doc.name}</Table.Cell>
                    <Table.Cell>{formatDate(doc.createdAt)}</Table.Cell>
                    <Table.Cell>
                      {doc.documentType && (
                        <a
                          className={styles.download}
                          href={doc.signedDocumentUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <div className={styles.row}>
                            <Icon
                              source={DOCUMENT_ICONS[doc.documentType]}
                              className={styles.icon}
                            />
                            {
                              <Typography variant="body1" color={"primary"}>
                                {formatFileSize(doc.size || undefined)}
                              </Typography>
                            }
                          </div>
                        </a>
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      <AccessControl dataModel="company" action="addDocument">
                        <Button
                          variant="text"
                          disabled={loadingDelete}
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
        onCloseClick={() => {
          setUploadDialog(false);
          setMutationError(null);
        }}
        onFilesChange={() => {
          setMutationError(null);
        }}
        onConfirmClick={uploadDialogConfirmHandler}
        loading={loadingCreate}
        errors={mutationError}
      />
      <ConfirmDialog
        state={confirmDialogState}
        onCancel={() => {
          setConfirmDialogState((prev) => ({ ...prev, isOpen: false }));
        }}
        onConfirm={() => {
          onConfirmDialogHandler(confirmDialogState.id);
        }}
      />
    </div>
  );
};

export const CompanyDocumentFragment = gql`
  fragment CompanyDocumentFragment on CompanyDocument {
    id
    document
    name
    documentType
    size
    signedDocumentUrl
    createdAt
    updatedAt
  }
`;

export const CompanyDocumentsFragment = gql`
  fragment CompanyDocumentsFragment on Company {
    companyDocuments {
      nodes {
        ...CompanyDocumentFragment
      }
    }
  }
`;

export const ADD_COMPANY_DOCUMENTS = gql`
  mutation createCompanyDocuments($input: CreateCompanyDocumentsInput!) {
    createCompanyDocuments(input: $input) {
      companyDocuments {
        ...CompanyDocumentFragment
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

import React, { useEffect, useState, useCallback } from "react";
import { useTranslation } from "next-i18next";
import Button from "@bmi/button";
import Table from "@bmi/table";
import Accordion from "@bmi/accordion";
import Typography from "@bmi/typography";
import { gql } from "@apollo/client";
import {
  EvidenceCategoryType,
  CustomEvidenceCategoryKey
} from "@bmi/intouch-api-types";
import VisibilityIcon from "@material-ui/icons/Visibility";
import DeleteIcon from "@material-ui/icons/Delete";
import {
  useAddEvidencesMutation,
  GetProjectDocument,
  useContentfulEvidenceCategoriesLazyQuery,
  useDeleteEvidenceItemMutation
} from "../../../graphql/generated/hooks";
import { NoContent } from "../../NoContent";
import { MediaGalleryState, GalleryItem } from "../../../lib/media/types";
import { MediaGallery } from "../../MediaGallery";
import styles from "./styles.module.scss";
import { AddEvidenceDialog, EvidenceCategory } from "./AddEvidenceDialog";

export type Evidence = {
  id: number;
  name: string;
  url?: string;
  canEvidenceDelete?: boolean;
};

export type UploadsTabProps = {
  projectId: number;
  guaranteeId?: number;
  uploads?: Map<string, Evidence[]>;
  isContentfulEvidenceAvailable?: boolean;
};

const getGalleryItems = (evidenceItems): GalleryItem[] =>
  evidenceItems.map(({ id, url, category, name }) => {
    const type = name.match(/(\w+)$/g)[0].includes("pdf") ? "pdf" : "image";
    return {
      type,
      id: id.toString(),
      url: (type === "image" && url) || "",
      title: `${category} / ${name}`,
      fileUrl: url
    } as const;
  });

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
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [modalInfo, setModalInfo] = useState<MediaGalleryState>({
    isOpen: false,
    activeItem: null
  });

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
      const result = evidenceCategoryCollection.items?.map(
        ({ sys, name, referenceCode }) => ({
          id: sys.id,
          name: name,
          referenceCode: referenceCode
        })
      );
      setEvidenceCategories(result);
    }
  });

  const [deleteEvidence] = useDeleteEvidenceItemMutation({
    refetchQueries: [
      {
        query: GetProjectDocument,
        variables: {
          projectId
        }
      }
    ]
  });

  const evidenceDialogConfirmHandler = async (
    evidenceCategoryType: EvidenceCategoryType,
    customEvidenceCategoryKey: string,
    uploadedFiles: File[]
  ) => {
    if (uploadedFiles.length > 0) {
      const evidences = uploadedFiles.map((attachmentUpload) => ({
        projectId,
        guaranteeId,
        attachmentUpload,
        customEvidenceCategoryKey:
          customEvidenceCategoryKey as CustomEvidenceCategoryKey,
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

  const onDeleteClickHandler = async (id: number) => {
    deleteEvidence({
      variables: {
        input: {
          id
        }
      }
    });
  };

  const handleCarouselToggle = useCallback(
    (evidenceId: number) => {
      setModalInfo({
        isOpen: true,
        activeItem: galleryItems.find(
          (galleryItem) => galleryItem.id === evidenceId.toString()
        )
      });
    },
    [setModalInfo, galleryItems]
  );

  const closeModal = useCallback(() => {
    setModalInfo({
      isOpen: false,
      activeItem: null
    });
  }, [setModalInfo]);

  useEffect(() => {
    if (uploads) {
      const evidenceItems = []
        .concat([...uploads.entries()])
        .filter(([key, values]) => values.length > 0)
        .flatMap(([key, values]) =>
          values.map((item) => ({ ...item, category: key }))
        );
      if (evidenceItems.length > 0) {
        setGalleryItems(getGalleryItems(evidenceItems));
      }
    }
  }, [uploads]);

  useEffect(() => {
    if (isContentfulEvidenceAvailable) {
      getEvidenceCategory();
    }
  }, [projectId, isContentfulEvidenceAvailable]);

  return (
    <>
      {uploads && (
        <MediaGallery
          isOpen={modalInfo.isOpen}
          activeItem={modalInfo.activeItem}
          items={galleryItems}
          onClose={closeModal}
        />
      )}
      <div className={styles.main}>
        <div className={styles.header}>
          <Button
            variant="outlined"
            onClick={() => setEvidenceDialogOpen(true)}
          >
            {t("upload_tab.header")}
          </Button>
        </div>
        <div className={styles.body}>
          <Accordion noInnerPadding={true}>
            {uploads &&
              [...uploads.entries()].map(([key, values]) => {
                return (
                  <Accordion.Item
                    key={key}
                    data-testid="uploads-category"
                    defaultExpanded={true}
                  >
                    <Accordion.Summary>
                      <Typography component="h1" variant="h6">
                        {key}
                      </Typography>
                    </Accordion.Summary>
                    <Accordion.Details>
                      {values.length > 0 ? (
                        <Table>
                          <Table.Body>
                            {values.map(
                              ({ url, name, id, canEvidenceDelete }, index) => (
                                <Table.Row
                                  key={`upload-items-${key}-${index}`}
                                  data-testid="uploads-item"
                                >
                                  <Table.Cell>
                                    <a
                                      className={styles.download}
                                      href={url}
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      {name}
                                    </a>
                                  </Table.Cell>
                                  <Table.Cell style={{ textAlign: "right" }}>
                                    <Button
                                      data-testid="upload-item-view"
                                      variant="text"
                                      onClick={() => {
                                        handleCarouselToggle(id);
                                      }}
                                    >
                                      <VisibilityIcon />
                                    </Button>
                                    {canEvidenceDelete && (
                                      <Button
                                        data-testid="upload-item-delete"
                                        variant="text"
                                        onClick={() => {
                                          onDeleteClickHandler(id);
                                        }}
                                      >
                                        <DeleteIcon color="primary" />
                                      </Button>
                                    )}
                                  </Table.Cell>
                                </Table.Row>
                              )
                            )}
                          </Table.Body>
                        </Table>
                      ) : (
                        <div className={styles.noContent}>
                          <NoContent message={t("upload_tab.noContent")} />
                        </div>
                      )}
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
    </>
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
        referenceCode
        minimumUploads
      }
    }
  }
`;
export const DELETE_PROJECT_EVIDENCE = gql`
  mutation deleteEvidenceItem($input: DeleteEvidenceItemInput!) {
    deleteEvidenceItem(input: $input) {
      evidenceItem {
        id
        name
        attachment
        guaranteeId
        evidenceCategoryType
      }
    }
  }
`;

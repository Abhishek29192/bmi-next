import React, { useEffect, useState, useCallback } from "react";
import { useTranslation } from "next-i18next";
import Button from "@bmi/button";
import Table from "@bmi/table";
import AnchorLink from "@bmi/anchor-link";
import Accordion from "@bmi/accordion";
import Typography from "@bmi/typography";
import Check from "@material-ui/icons/Check";
import { gql } from "@apollo/client";
import {
  EvidenceCategoryType,
  CustomEvidenceCategoryKey,
  RequestStatus,
  Guarantee
} from "@bmi/intouch-api-types";
import VisibilityIcon from "@material-ui/icons/Visibility";
import DeleteIcon from "@material-ui/icons/Delete";
import {
  useAddEvidencesMutation,
  GetProjectDocument,
  useDeleteEvidenceItemMutation
} from "../../../graphql/generated/hooks";
import { GetProjectQuery } from "../../../graphql/generated/operations";
import { NoContent } from "../../NoContent";
import { MediaGalleryState, GalleryItem } from "../../../lib/media/types";
import { MediaGallery } from "../../MediaGallery";
import {
  findProjectGuarantee,
  getGuaranteeStatus
} from "../../../lib/utils/project";
import AccessControl from "../../../lib/permissions/AccessControl";
import { DeepPartial } from "../../../lib/utils/types";
import styles from "./styles.module.scss";
import { AddEvidenceDialog } from "./AddEvidenceDialog";
import RequirementDialog from "./RequirementDialog";

type Evidence = {
  id: number;
  name: string;
  url?: string;
  category?: string;
  canEvidenceDelete?: boolean;
};
type EvidenceCollection = {
  evidences: Evidence[];
  minumumUploads?: number;
  description?: any;
};
export type UploadsTabProps = {
  project: GetProjectQuery["project"];
};

const getGalleryItems = (evidenceItems: Evidence[]): GalleryItem[] =>
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
const isEvidenceDelete = (
  evidenceCategoryType: EvidenceCategoryType,
  guaranteeStatus: RequestStatus
): boolean => {
  return (
    evidenceCategoryType === "MISCELLANEOUS" ||
    (evidenceCategoryType === "CUSTOM" &&
      !["REVIEW", "APPROVED"].includes(guaranteeStatus))
  );
};
const getUploads = (project: GetProjectQuery["project"]) => {
  const { evidenceItems } = project;
  const uploads = new Map<string, EvidenceCollection>();

  //Default custom guarantee types
  const evidenceCategories =
    findProjectGuarantee(project)?.guaranteeType?.evidenceCategoriesCollection
      ?.items || [];
  for (const evidenceCategory of evidenceCategories.filter(Boolean)) {
    uploads.set(evidenceCategory.name, {
      evidences: [],
      minumumUploads: evidenceCategory?.minimumUploads,
      description: evidenceCategory?.description?.json
    });
  }

  //Exist evidences
  for (const evidence of evidenceItems.nodes) {
    const {
      id,
      name,
      signedUrl,
      evidenceCategoryType,
      customEvidenceCategory
    } = evidence;

    const categoryLabel =
      evidenceCategoryType !== "CUSTOM"
        ? evidenceCategoryType
        : customEvidenceCategory?.name || evidenceCategoryType;

    const canEvidenceDelete = isEvidenceDelete(
      evidenceCategoryType,
      getGuaranteeStatus(project)
    );

    const existCategory = uploads.has(categoryLabel)
      ? uploads.get(categoryLabel)
      : { evidences: [] };

    uploads.set(categoryLabel, {
      ...existCategory,
      evidences: [
        ...existCategory.evidences,
        {
          id,
          name,
          url: signedUrl,
          category: categoryLabel,
          canEvidenceDelete
        }
      ]
    });
  }

  //Default category
  if (!uploads.has("MISCELLANEOUS"))
    uploads.set("MISCELLANEOUS", { evidences: [] });

  return uploads;
};
const isCustomEvidenceAvailable = (guarantee: DeepPartial<Guarantee>) => {
  return (
    guarantee?.coverage === "SOLUTION" &&
    !["APPROVED", "REVIEW"].includes(guarantee?.status)
  );
};

export const UploadsTab = ({ project }: UploadsTabProps) => {
  const { t } = useTranslation("project-page");

  const { id: projectId } = project;
  const currentGuarantee = findProjectGuarantee(project);
  const customEvidenceAvailable = isCustomEvidenceAvailable(currentGuarantee);

  const [isEvidenceDialogOpen, setEvidenceDialogOpen] = useState(false);
  const [isRequirementOpen, setRequirementOpen] = useState(false);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [modalInfo, setModalInfo] = useState<MediaGalleryState>({
    isOpen: false,
    activeItem: null
  });
  const [selectedEvidenceCollection, setSelectedEvidenceCollection] =
    useState<EvidenceCollection>();

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
    customEvidenceCategoryKey: CustomEvidenceCategoryKey,
    uploadedFiles: File[]
  ) => {
    if (uploadedFiles.length > 0) {
      const evidences = uploadedFiles.map((attachmentUpload) => ({
        projectId,
        guaranteeId:
          currentGuarantee?.coverage === "SOLUTION"
            ? currentGuarantee.id
            : null,
        attachmentUpload,
        customEvidenceCategoryKey,
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
  const requiredHandler = (evidenceCollection: EvidenceCollection) => {
    setSelectedEvidenceCollection(evidenceCollection);
    setRequirementOpen(true);
  };

  const uploads = getUploads(project);

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
      const evidenceItems: Evidence[] = []
        .concat([...uploads.entries()])
        .filter(([key, values]) => values?.evidences?.length > 0)
        .flatMap(([key, values]) => values.evidences);
      if (evidenceItems.length > 0) {
        setGalleryItems(getGalleryItems(evidenceItems));
      }
    }
  }, [projectId]);

  return (
    <>
      <MediaGallery
        isOpen={modalInfo.isOpen}
        activeItem={modalInfo.activeItem}
        items={galleryItems}
        onClose={closeModal}
      />
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
              [...uploads.entries()].map(([key, values], index) => {
                return (
                  <Accordion.Item
                    key={`${key}-${index}`}
                    data-testid={`uploads-category-${key}`}
                    defaultExpanded={true}
                  >
                    <Accordion.Summary>
                      <Typography
                        component="h1"
                        variant="h6"
                        data-testid="uploads-category"
                      >
                        {t(key)}
                      </Typography>
                      <div>
                        {values?.evidences?.length < values?.minumumUploads ? (
                          <AnchorLink
                            onClick={() => {
                              requiredHandler(values);
                            }}
                          >
                            {t("upload_tab.requirementModal.title")}
                          </AnchorLink>
                        ) : (
                          <Check style={{ color: "green" }} />
                        )}
                      </div>
                    </Accordion.Summary>
                    <Accordion.Details>
                      {values.evidences.length > 0 ? (
                        <Table>
                          <Table.Body>
                            {values.evidences.map((value, index) => (
                              <Table.Row
                                key={`upload-items-${key}-${index}-${value.id}`}
                                data-testid="uploads-item"
                              >
                                <Table.Cell>
                                  <a
                                    className={styles.download}
                                    href={value.url}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    {value.name}
                                  </a>
                                </Table.Cell>
                                <Table.Cell style={{ textAlign: "right" }}>
                                  <Button
                                    data-testid="upload-item-view"
                                    variant="text"
                                    onClick={() =>
                                      handleCarouselToggle(value.id)
                                    }
                                  >
                                    <VisibilityIcon color="disabled" />
                                  </Button>
                                  {value.canEvidenceDelete && (
                                    <AccessControl
                                      dataModel="project"
                                      action="deleteEvidence"
                                    >
                                      <Button
                                        data-testid="upload-item-delete"
                                        variant="text"
                                        onClick={() => {
                                          onDeleteClickHandler(value.id);
                                        }}
                                      >
                                        <DeleteIcon color="primary" />
                                      </Button>
                                    </AccessControl>
                                  )}
                                </Table.Cell>
                              </Table.Row>
                            ))}
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
        <AddEvidenceDialog
          isOpen={isEvidenceDialogOpen}
          evidenceCategories={
            customEvidenceAvailable
              ? currentGuarantee.guaranteeType?.evidenceCategoriesCollection
                  ?.items || []
              : null
          }
          onCloseClick={() => setEvidenceDialogOpen(false)}
          onConfirmClick={evidenceDialogConfirmHandler}
        />
        <RequirementDialog
          isOpen={isRequirementOpen}
          description={selectedEvidenceCollection?.description}
          onCloseClick={() => setRequirementOpen(false)}
        />
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

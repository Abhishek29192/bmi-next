import React, { useState, useContext } from "react";
import { groupBy, uniqBy } from "lodash";
import Table from "@bmi/table";
import Icon, { iconMap } from "@bmi/icon";
import Tooltip from "@bmi/tooltip";
import AnchorLink from "@bmi/anchor-link";
import Dialog from "@bmi/dialog";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Button from "@bmi/button";
import InfoIcon from "@material-ui/icons/Info";
import RichText from "./RichText";
import { SiteContext } from "./Site";
import { Data as PIMDocument } from "./PIMDocument";
import styles from "./styles/DocumentTechnicalTableResults.module.scss";
import Clickable from "@bmi/clickable";

const AssetHeader = ({
  assetType
}: {
  assetType: PIMDocument["assetType"];
}) => {
  const { name, code, description } = assetType;
  const [isTooltipActive, setIsTooltipActive] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const { getMicroCopy } = useContext(SiteContext);

  return (
    <>
      {description && (
        <Dialog open={isDialogOpen} onCloseClick={() => setIsDialogOpen(false)}>
          <Dialog.Title>
            {name} ({code})
          </Dialog.Title>
          <Dialog.Content>
            <RichText document={description.json} />
          </Dialog.Content>
          <Dialog.Actions
            confirmLabel={getMicroCopy("dialog.close")}
            onConfirmClick={() => setIsDialogOpen(false)}
          />
        </Dialog>
      )}
      <ClickAwayListener
        onClickAway={() => {
          setIsTooltipActive(false);
        }}
      >
        <Tooltip
          PopperProps={{
            disablePortal: true
          }}
          title={
            <>
              {name}
              {description && (
                <>
                  <br />
                  <AnchorLink
                    onClick={() => setIsDialogOpen(true)}
                    color="white"
                  >
                    {getMicroCopy("global.learnMore")}...
                  </AnchorLink>
                </>
              )}
            </>
          }
          open={isTooltipActive}
          interactive={!!description}
        >
          <div>
            <Button
              isIconButton
              variant="text"
              size={42}
              onClick={() =>
                setIsTooltipActive(
                  (prevIsTooltipActive) => !prevIsTooltipActive
                )
              }
            >
              <Icon source={InfoIcon} className={styles["tooltip-icon"]} />
            </Button>
          </div>
        </Tooltip>
      </ClickAwayListener>
    </>
  );
};
type Props = {
  documents: PIMDocument[];
};
const fileIconsMap = {
  PDF: iconMap.FilePDF,
  JPG: iconMap.FileJPG,
  JPEG: iconMap.FileJPEG,
  PNG: iconMap.FilePNG
};

const DocumentTechnicalTableResults = ({ documents }: Props) => {
  const documentsByProduct = groupBy(documents, "product.name");
  const assetTypes = uniqBy(
    documents.map(({ assetType }) => assetType),
    "id"
  );

  return (
    <div className={styles["DocumentTechnicalTableResults"]}>
      <Table>
        <Table.Head>
          <Table.Row className={styles["header-row"]}>
            <Table.Cell>Product</Table.Cell>
            {assetTypes.map((assetType, index) => {
              return (
                <Table.Cell
                  key={`asset-type-${assetType.id}-${index}`}
                  className={styles["asset-type-cell"]}
                >
                  {assetType.code}
                  <AssetHeader assetType={assetType} />
                </Table.Cell>
              );
            })}
            <Table.Cell>
              <span className={styles["all-files-header-wrapper"]}>
                <Icon
                  source={iconMap.Download}
                  className={styles["all-files-icon"]}
                />
                <span>All Files</span>
              </span>
            </Table.Cell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {Object.entries(documentsByProduct).map(
            ([productName, assets], index) => {
              return (
                <Table.Row key={index}>
                  <Table.Cell>{productName}</Table.Cell>
                  {assetTypes.map((assetType, index) => {
                    const asset = assets.find(
                      ({ assetType: { id } }) => id === assetType.id
                    );

                    if (!asset) {
                      return (
                        <Table.Cell
                          key={`${productName}-missing-asset-${index}`}
                          className={styles["align-center"]}
                        >
                          <Icon
                            source={iconMap.Cross}
                            className={styles["no-document-icon"]}
                          />
                        </Table.Cell>
                      );
                    }

                    const FileIcon = fileIconsMap[asset.format];

                    return (
                      <Table.Cell
                        key={`${productName}-asset-${asset.id}`}
                        className={styles["align-center"]}
                      >
                        <Clickable
                          model="download"
                          href={asset.url}
                          // download={asset.title}
                        >
                          <FileIcon className={styles["format-icon"]} />
                        </Clickable>
                      </Table.Cell>
                    );
                  })}
                  <Table.Cell className={styles["align-center"]}>
                    [ ]
                  </Table.Cell>
                </Table.Row>
              );
            }
          )}
        </Table.Body>
      </Table>
    </div>
  );
};

export default DocumentTechnicalTableResults;

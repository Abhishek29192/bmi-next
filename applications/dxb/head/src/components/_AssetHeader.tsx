import React, { useState, useContext } from "react";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import InfoIcon from "@material-ui/icons/Info";
import Icon from "@bmi/icon";
import Tooltip from "@bmi/tooltip";
import AnchorLink from "@bmi/anchor-link";
import Dialog from "@bmi/dialog";
import Button from "@bmi/button";
import {
  PIMDocumentData,
  PIMLinkDocumentData
} from "../components/types/PIMDocumentBase";
import RichText from "./RichText";
import { SiteContext } from "./Site";
import styles from "./styles/DocumentTechnicalTableResults.module.scss";

const AssetHeader = ({
  assetType
}: {
  assetType: PIMDocumentData["assetType"] | PIMLinkDocumentData["assetType"];
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
            <RichText document={description} />
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

export default AssetHeader;
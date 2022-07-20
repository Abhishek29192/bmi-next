import { AnchorLink, Button, Dialog, Icon, Tooltip } from "@bmi/components";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import InfoIcon from "@material-ui/icons/Info";
import React, { useState } from "react";
import RichText from "../../../components/RichText";
import { useSiteContext } from "../../../components/Site";
import { microCopy } from "../../../constants/microCopies";
import { ContentfulAssetType as AssetTypeData } from "../../../types/AssetType";
import styles from "./styles/DocumentTechnicalTableResults.module.scss";

const AssetHeader = ({ assetType }: { assetType: AssetTypeData }) => {
  const { name, code, description } = assetType;
  const [isTooltipActive, setIsTooltipActive] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const { getMicroCopy } = useSiteContext();

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
            confirmLabel={getMicroCopy(microCopy.DIALOG_CLOSE)}
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
                    {getMicroCopy(microCopy.GLOBAL_LEARN_MORE)}...
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

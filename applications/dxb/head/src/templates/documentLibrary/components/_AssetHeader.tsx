import { AnchorLink, Button, Dialog, Icon, Tooltip } from "@bmi/components";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import InfoIcon from "@material-ui/icons/Info";
import React, { useState } from "react";
import RichText from "../../../components/RichText";
import { useSiteContext } from "../../../components/Site";
import { useStyles } from "../../../components/styles/DocumentTechnicalTableResultsStyles";
import { microCopy } from "../../../constants/microCopies";
import { AssetType } from "../types";

const AssetHeader = ({ assetType }: { assetType: AssetType }) => {
  const { name, code, description } = assetType;
  const [isTooltipActive, setIsTooltipActive] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const { getMicroCopy } = useSiteContext();
  const classes = useStyles();

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
              <Icon source={InfoIcon} className={classes.tooltipIcon} />
            </Button>
          </div>
        </Tooltip>
      </ClickAwayListener>
    </>
  );
};

export default AssetHeader;

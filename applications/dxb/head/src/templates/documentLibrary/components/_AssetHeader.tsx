import {
  AnchorLink,
  Button,
  Dialog,
  Icon,
  Tooltip
} from "@bmi-digital/components";
import InfoIcon from "@mui/icons-material/Info";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import React, { useState } from "react";
import RichText from "../../../components/RichText";
import { useSiteContext } from "../../../components/Site";
import { microCopy } from "../../../constants/microCopies";
import { AssetType } from "../types";
import { Root, classes } from "./DocumentTechnicalTableResultsStyles";

const AssetHeader = ({ assetType }: { assetType: AssetType }) => {
  const { name, code, description } = assetType;
  const [isTooltipActive, setIsTooltipActive] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const { getMicroCopy } = useSiteContext();

  return (
    <Root data-testid="asset-header-tech-results-table">
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
          disableInteractive={!description}
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
    </Root>
  );
};

export default AssetHeader;

import { useEffect } from "react";

// workaround of accessability issue of Material UI modal's components
// if prop disablePortal is true e.g. Modal, Dialog, Popover, Popper
// https://github.com/mui-org/material-ui/issues/19450
export const useDisablePortalModalWorkaround = (
  open: boolean,
  disablePortal?: boolean
) => {
  useEffect(() => {
    if (open && disablePortal) {
      Array.from(document.body.children).forEach((child) => {
        const isSkippedTag = ["SCRIPT", "IFRAME", "NOSCRIPT"].some(
          (tagName) => child.tagName === tagName
        );
        if (!isSkippedTag) {
          child.setAttribute("aria-hidden", "false");
        }
      });
    }
  }, [open, disablePortal]);
};

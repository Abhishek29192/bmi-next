import React from "react";
import Drawer from "@material-ui/core/Drawer";

interface Props {
  open: boolean;
  children: React.ReactNode | React.ReactNode[];
}

const NotificationsPanel = ({ open, children }: Props) => (
  <Drawer variant="persistent" anchor="right" open={open}>
    <div style={{ width: 350 }}>{children}</div>
  </Drawer>
);

export default NotificationsPanel;

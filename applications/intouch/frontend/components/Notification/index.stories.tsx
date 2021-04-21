import React from "react";
import { NotificationsPanel } from "../NotificationsPanel";
import { Notification } from ".";

export default {
  title: "Notifications",
  component: Notification
};

export const Basic = () => (
  <NotificationsPanel open={true}>
    <Notification>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis
      tenetur unde suscipit, quam beatae rerum inventore consectetur, neque
      doloribus, cupiditate numquam dignissimos laborum fugiat deleniti? Eum
      quasi quidem <a href="#">quibusdam</a>.
    </Notification>
  </NotificationsPanel>
);

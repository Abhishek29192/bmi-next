import React from "react";
import { useUser } from "@auth0/nextjs-auth0";
import can from "./can";

type AccessControlProps = {
  dataModel: string;
  action: string;
  extraData?: any;
  children: React.ReactNode;
};

const AccessControl = (props: AccessControlProps) => {
  const { user } = useUser();

  if (!user) {
    // User can be undefined on first render
    return null;
  }

  const { dataModel, action, extraData, children } = props;

  if (!can(user, dataModel, action, extraData)) {
    return <div>Not allowed</div>;
  }

  // todo: fallback view?

  return <>{children}</>;
};

export default AccessControl;

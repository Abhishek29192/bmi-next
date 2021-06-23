import React from "react";
import { useAuthContext } from "../../context/UserContext";
import can from "./can";

type AccessControlProps = {
  dataModel: string;
  action: string;
  extraData?: any;
  children: React.ReactNode;
};

const AccessControl = (props: AccessControlProps) => {
  const { account } = useAuthContext();

  if (!account) {
    // User can be undefined on first render
    return null;
  }

  const { dataModel, action, extraData, children } = props;

  if (!can(account, dataModel, action, extraData)) {
    return <div>Not allowed</div>;
  }

  // todo: fallback view?

  return <>{children}</>;
};

export default AccessControl;

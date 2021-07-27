import React from "react";
import { useAccountContext } from "../../context/AccountContext";
import can from "./can";

type AccessControlProps = {
  dataModel: string;
  action: string;
  extraData?: any;
  message?: string;
  children: React.ReactNode;
};

const AccessControl = (props: AccessControlProps) => {
  const { account } = useAccountContext();

  if (!account) {
    // User can be undefined on first render
    return null;
  }

  const { dataModel, action, extraData, children, message } = props;

  if (!can(account, dataModel, action, extraData)) {
    return message ? <div>{message}</div> : null;
  }

  // todo: fallback view?

  return <>{children}</>;
};

export default AccessControl;

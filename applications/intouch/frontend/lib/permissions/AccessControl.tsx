import React from "react";
import { useAccountContext } from "../../context/AccountContext";
import can from "./can";

type AccessControlProps = {
  dataModel: string;
  action: string;
  extraData?: any;
  message?: string;
  children: React.ReactNode;
  fallbackView?: React.ReactNode;
};

const AccessControl = ({
  dataModel,
  action,
  extraData,
  children,
  message,
  fallbackView
}: AccessControlProps) => {
  const { account } = useAccountContext();

  if (!account) {
    // User can be undefined on first render
    return null;
  }

  if (can(account, dataModel, action, extraData)) {
    return <>{children}</>;
  }

  if (fallbackView) {
    return <>{fallbackView}</>;
  }

  return message ? <div>{message}</div> : null;
};

export default AccessControl;

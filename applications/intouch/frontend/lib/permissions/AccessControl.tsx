import React from "react";
import { useAccountContext } from "../../context/AccountContext";
import can from "./can";

type AccessControlProps = {
  dataModel: string;
  action: string;
  extraData?: any;
  children: React.ReactNode;
};

const AccessControl = (props: AccessControlProps) => {
  const { account } = useAccountContext();

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

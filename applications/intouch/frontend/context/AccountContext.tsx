import React, { useState, createContext } from "react";
import { Account } from "@bmi/intouch-api-types";

type ContextProps = {
  account: Account;
};

type ContextWrapperProps = {
  account: Account;
  children?: React.ReactNode;
};

export const AccountContext = createContext<ContextProps>(null);
export const useAccountContext = () => React.useContext(AccountContext);

const AccountContextWrapper = ({ account, children }: ContextWrapperProps) => {
  const [currentUser] = useState<Account>(account);

  return (
    <AccountContext.Provider value={{ account: currentUser }}>
      {children}
    </AccountContext.Provider>
  );
};

export default AccountContextWrapper;

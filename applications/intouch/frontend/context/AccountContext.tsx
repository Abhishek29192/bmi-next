import React, { useState, createContext, useEffect } from "react";
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
  const [currentUser, setCurrentUser] = useState<Account>(account);

  useEffect(() => {
    setCurrentUser(account);
  }, [account]);

  return (
    <AccountContext.Provider value={{ account: currentUser }}>
      {children}
    </AccountContext.Provider>
  );
};

export default AccountContextWrapper;

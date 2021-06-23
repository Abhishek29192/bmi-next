import React, { useState, createContext } from "react";
import { Account } from "@bmi/intouch-api-types";

type ContextProps = {
  account: Account;
};

type ContextWrapperProps = {
  account: Account;
  children?: React.ReactNode;
};

export const UserContext = createContext<ContextProps>(null);
export const useAuthContext = () => React.useContext(UserContext);

const UserContextWrapper = ({ account, children }: ContextWrapperProps) => {
  const [currentUser] = useState<Account>(account);

  return (
    <UserContext.Provider value={{ account: currentUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextWrapper;

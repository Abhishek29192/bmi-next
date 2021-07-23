import React from "react";
import { Account } from "@bmi/intouch-api-types";
import AccountContextWrapper from "../../../context/AccountContext";
import { generateAccount } from "../factories/account";

const Wrapper = ({
  account = generateAccount(),
  children
}: {
  account?: Account;
  children: React.ReactNode;
}) => {
  return (
    <AccountContextWrapper account={account}>{children}</AccountContextWrapper>
  );
};

export default Wrapper;

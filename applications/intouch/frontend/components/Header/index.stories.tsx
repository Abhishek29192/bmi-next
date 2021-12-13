import React from "react";
import ApolloContext from "../../lib/tests/fixtures/apollo";
import AccountContext from "../../lib/tests/fixtures/account";
import { generateAccount } from "../../lib/tests/factories/account";
import { Header, HeaderProps } from ".";

export default {
  title: "Header",
  component: Header,
  argTypes: {
    title: { control: "text" }
  }
};

export const Basic = ({ title }: HeaderProps) => (
  <ApolloContext>
    <AccountContext>
      <Header title={title} />
    </AccountContext>
  </ApolloContext>
);

Basic.args = {
  title: "JS Roofers"
};

export const AttentionHeading = ({ title }: HeaderProps) => {
  const accountWithDeactivatedCompany = generateAccount({
    hasCompany: true,
    companyStatus: "DEACTIVATED"
  });

  return (
    <ApolloContext>
      <AccountContext account={accountWithDeactivatedCompany}>
        <Header title={title} />
      </AccountContext>
    </ApolloContext>
  );
};

AttentionHeading.args = {
  title: "JS Roofers"
};

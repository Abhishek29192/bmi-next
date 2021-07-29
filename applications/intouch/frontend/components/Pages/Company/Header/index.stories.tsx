import React from "react";
import { mockCompany } from "../../../../fixtures/company";
import { ROLES } from "../../../../lib/constants";
import { generateAccount } from "../../../../lib/tests/factories/account";
import AccountContextWrapper from "../../../../lib/tests/fixtures/account";
import { CompanyHeader } from ".";

export default {
  title: "Company Page/Company Header",
  component: CompanyHeader
};

export const Basic = () => (
  <AccountContextWrapper
    account={generateAccount({
      role: ROLES.COMPANY_ADMIN,
      account: {
        id: mockCompany.companyMembers.nodes[0].account.id
      }
    })}
  >
    <CompanyHeader company={mockCompany} />
  </AccountContextWrapper>
);

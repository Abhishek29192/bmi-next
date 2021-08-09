import React from "react";
import { mockCompany } from "../../../../fixtures/company";
import { ROLES } from "../../../../lib/constants";
import { generateAccount } from "../../../../lib/tests/factories/account";
import AccountContextWrapper from "../../../../lib/tests/fixtures/account";
import { EditCompanyButton } from "../EditCompany/Button";
import { CompanyDetails } from ".";

export default {
  title: "Company Page/Company Header",
  component: CompanyDetails
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
    <CompanyDetails
      company={mockCompany}
      actions={
        <EditCompanyButton
          company={mockCompany}
          onCompanyUpdateSuccess={() => {
            window.alert("success");
          }}
        />
      }
    />
  </AccountContextWrapper>
);

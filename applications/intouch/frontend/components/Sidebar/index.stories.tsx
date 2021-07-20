import React from "react";
import AccountContextWrapper from "../../lib/tests/fixtures/account";
import { generateAccount } from "../../lib/tests/factories/account";
import { Sidebar } from ".";

export default {
  title: "Sidebar",
  component: Sidebar
};

export const Installer = () => (
  <AccountContextWrapper account={generateAccount()}>
    <Sidebar />
  </AccountContextWrapper>
);

export const InstallerInACompany = () => (
  <AccountContextWrapper
    account={generateAccount({ role: "INSTALLER", hasCompany: true })}
  >
    <Sidebar />
  </AccountContextWrapper>
);

export const InstallerInTier2 = () => (
  <AccountContextWrapper
    account={generateAccount({
      role: "INSTALLER",
      hasCompany: true,
      companyTier: "T2",
      projectsCount: 1
    })}
  >
    <Sidebar />
  </AccountContextWrapper>
);

export const InstallerWithProjects = () => (
  <AccountContextWrapper
    account={generateAccount({
      role: "INSTALLER",
      hasCompany: true,
      projectsCount: 1
    })}
  >
    <Sidebar />
  </AccountContextWrapper>
);

export const CompanyAdmin = () => (
  <AccountContextWrapper
    account={generateAccount({
      role: "COMPANY_ADMIN",
      hasCompany: true,
      projectsCount: 1
    })}
  >
    <Sidebar />
  </AccountContextWrapper>
);

export const MarketAdmin = () => (
  <AccountContextWrapper account={generateAccount({ role: "MARKET_ADMIN" })}>
    <Sidebar />
  </AccountContextWrapper>
);

export const SuperAdmin = () => (
  <AccountContextWrapper account={generateAccount({ role: "SUPER_ADMIN" })}>
    <Sidebar />
  </AccountContextWrapper>
);

export const Interactive = (props) => (
  <AccountContextWrapper account={generateAccount(props)}>
    <Sidebar />
  </AccountContextWrapper>
);

Interactive.argTypes = {
  role: {
    options: ["INSTALLER", "COMPANY_ADMIN", "MARKET_ADMIN", "SUPER_ADMIN"],
    defaultValue: "INSTALLER",
    control: { type: "select" }
  },
  hasCompany: {
    control: { type: "boolean" }
  },
  companyTier: {
    options: ["T1", "T2", "T3", "T4"],
    defaultValue: "T1",
    control: { type: "select" }
  },
  companyStatus: {
    options: ["NEW", "ACTIVE", "DEACTIVATED"],
    defaultValue: "ACTIVE",
    control: { type: "select" }
  },
  projectsCount: {
    defaultValue: 0,
    control: { type: "number", min: 0, max: 2, step: 1 }
  }
};

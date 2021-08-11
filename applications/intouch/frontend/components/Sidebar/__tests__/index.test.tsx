import React from "react";
import { renderWithI18NProvider } from "../../../lib/tests/utils";

import {
  Installer,
  InstallerInACompany,
  InstallerInTier2,
  InstallerWithProjects,
  CompanyAdmin,
  MarketAdmin,
  SuperAdmin
} from "../index.stories";

const testStorySnapshot = (Story) => {
  const { container } = renderWithI18NProvider(<Story />);

  expect(container.firstChild).toMatchSnapshot();
};

const storySnapshot = (Story) => () => {
  const { container } = renderWithI18NProvider(<Story />);

  expect(container.firstChild).toMatchSnapshot();
};

describe("Sidebar component", () => {
  it("renders correctly for installer", storySnapshot(Installer));
  it("renders correctly for installer in a company", () =>
    testStorySnapshot(InstallerInACompany));
  it("renders correctly for installer in a T2 company", () =>
    testStorySnapshot(InstallerInTier2));
  it("renders correctly for installer with projects", () =>
    testStorySnapshot(InstallerWithProjects));
  it("renders correctly for company admin", () =>
    testStorySnapshot(CompanyAdmin));
  it("renders correctly for market admin", () =>
    testStorySnapshot(MarketAdmin));
  it("renders correctly for super admin", () => testStorySnapshot(SuperAdmin));
});

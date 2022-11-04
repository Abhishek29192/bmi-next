import React, { useRef } from "react";
import { renderWithI18NProvider } from "../../../../../lib/tests/utils";
import { GetProjectQuery } from "../../../../../graphql/generated/operations";
import { SystemGuarantee } from "..";

const mockSystem: GetProjectQuery["project"]["guarantees"]["nodes"][0]["systemBySystemBmiRef"] =
  {
    id: 1,
    name: "BMI-NO-PROD-001",
    description: "",
    systemMembersBySystemBmiRef: null
  };

jest.mock("@bmi-digital/use-dimensions", () => ({
  __esModule: true,
  default: () => [useRef(), jest.fn()]
}));

describe("SystemGuarantee Component", () => {
  const mockSystemGuarantee: GetProjectQuery["project"]["guarantees"]["nodes"][0] =
    {
      id: 1,
      guaranteeReferenceCode: "FLAT_SYSTEM",
      coverage: "SYSTEM",
      status: "APPROVED",
      systemBySystemBmiRef: mockSystem
    };

  it("renders correctly", () => {
    const { container } = renderWithI18NProvider(
      <SystemGuarantee guarantee={mockSystemGuarantee} />
    );

    expect(container).toMatchSnapshot();
  });

  it("renders correctly with download button", () => {
    mockSystemGuarantee.signedFileStorageUrl = "signed-url";
    const { container } = renderWithI18NProvider(
      <SystemGuarantee
        guarantee={{ ...mockSystemGuarantee, status: "ISSUED" }}
      />
    );

    expect(container).toMatchSnapshot();
  });
});

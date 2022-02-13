import React, { useRef } from "react";
import { Technology } from "@bmi/intouch-api-types";
import TeamMemberCertification from "../TeamMemberCertifications";
import { renderWithI18NProvider, screen } from "../../../../lib/tests/utils";

jest.mock("@bmi-digital/use-dimensions", () => ({
  __esModule: true,
  default: () => [useRef(), jest.fn()]
}));
describe("TeamMemberCertification Components", () => {
  const certifications: Technology[] = ["FLAT", "PITCHED"];
  it("non certification", () => {
    renderWithI18NProvider(<TeamMemberCertification certifications={[]} />);
    expect(screen.queryByTestId("icon-FLAT")).toBeNull();
    expect(screen.queryByTestId("icon-PITCHED")).toBeNull();
    expect(screen.queryByTestId("icon-OTHER")).toBeNull();
  });

  it("should show flat and pitched certifications", () => {
    renderWithI18NProvider(
      <TeamMemberCertification certifications={certifications} />
    );
    expect(screen.getAllByTestId("icon-FLAT")).toHaveLength(1);
    expect(screen.getAllByTestId("icon-PITCHED")).toHaveLength(1);
  });
});

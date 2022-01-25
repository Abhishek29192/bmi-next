import React from "react";
import { renderWithI18NProvider, screen } from "../../../../lib/tests/utils";
import { ProjectsInsight } from "..";

describe("ProjectsInsight component", () => {
  it("renders correctly", () => {
    const { container } = renderWithI18NProvider(
      <ProjectsInsight daysRemaining={0} certifiedInstallers={0} />
    );
    expect(container).toMatchSnapshot();
  });
  it("should highlight certificate If there are zero relevantly installers", () => {
    renderWithI18NProvider(
      <ProjectsInsight daysRemaining={0} certifiedInstallers={0} />
    );
    expect(screen.getByTestId("certified-installers")).toHaveClass(
      "certificate--warning"
    );
  });
});

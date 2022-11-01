import React from "react";
import { renderWithThemeProvider } from "../../__tests__/helper";
import LocationCard from "../LocationCard";

describe("LocationCard component", () => {
  it("renders correctly with props", () => {
    const { container } = renderWithThemeProvider(
      <LocationCard
        title="Area 51"
        details={[
          {
            type: "address",
            text: "37°14′0″N 115°48′30″W",
            label: "Address"
          },
          {
            type: "phone",
            text: "000000000000",
            action: { model: "htmlLink", href: "tel:000000000000" },
            label: "Telephone"
          },
          {
            type: "email",
            text: "area@51.space",
            action: { model: "htmlLink", href: "email:area@51.space" },
            label: "Email"
          }
        ]}
        footNote="Monday - Friday, 9:00 - 17:00"
      />
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly if isFlat === true", () => {
    const { container } = renderWithThemeProvider(
      <LocationCard
        isFlat
        title="Area 51"
        details={[
          {
            type: "address",
            text: "37°14′0″N 115°48′30″W",
            label: "Address"
          },
          {
            type: "phone",
            text: "000000000000",
            action: { model: "htmlLink", href: "tel:000000000000" },
            label: "Telephone"
          },
          {
            type: "email",
            text: "area@51.space",
            action: { model: "htmlLink", href: "email:area@51.space" },
            label: "Email"
          }
        ]}
        footNote="Monday - Friday, 9:00 - 17:00"
      />
    );
    expect(container).toMatchSnapshot();
  });
});

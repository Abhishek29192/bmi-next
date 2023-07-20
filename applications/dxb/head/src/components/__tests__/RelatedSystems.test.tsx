import { ThemeProvider } from "@bmi-digital/components";
import {
  createSystem as createEsSystem,
  System as EsSystem
} from "@bmi/elasticsearch-types";
import { render, screen, within } from "@testing-library/react";
import React from "react";
import createPimImage from "../../__tests__/helpers/PimImageHelper";
import createRelatedSystem from "../../__tests__/helpers/RelatedSystemHelper";
import createSystem from "../../__tests__/helpers/SystemHelper";
import { RelatedSystem, System } from "../../types/pim";
import RelatedSystems, { SystemCard } from "../RelatedSystems";

describe("RelatedSystems component", () => {
  it("renders correctly with no systems", () => {
    const { container } = render(
      <ThemeProvider>
        <RelatedSystems countryCode="en" systems={[]} />
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly with systems", () => {
    const systems: System[] = [createSystem()];

    const { container } = render(
      <ThemeProvider>
        <RelatedSystems countryCode="en" systems={systems} />
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly without categories", () => {
    const systems: System[] = [createSystem({ categories: undefined })];

    const { container } = render(
      <ThemeProvider>
        <RelatedSystems countryCode="en" systems={systems} />
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders systems correctly without classifications", () => {
    const systems: System[] = [createSystem({ classifications: undefined })];

    const { container } = render(
      <ThemeProvider>
        <RelatedSystems countryCode="en" systems={systems} />
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });
  it("renders correctly with scoringweight", () => {
    const systems: System[] = [
      createSystem({ scoringWeight: 2 }),
      createSystem({ scoringWeight: 3 })
    ];

    const { container } = render(
      <ThemeProvider>
        <RelatedSystems countryCode="en" systems={systems} />
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly with scoringweight equal", () => {
    const systems: System[] = [
      createSystem({ scoringWeight: 2 }),
      createSystem({ scoringWeight: 2 })
    ];

    const { container } = render(
      <ThemeProvider>
        <RelatedSystems countryCode="en" systems={systems} />
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly when scoringweight equal & names equal", () => {
    const systems: System[] = [
      createSystem({ scoringWeight: 2, name: "system-1" }),
      createSystem({ scoringWeight: 2, name: "system-1" })
    ];

    const { container } = render(
      <ThemeProvider>
        <RelatedSystems countryCode="en" systems={systems} />
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly with scoringweight equal & names sorted opposite", () => {
    const systems: System[] = [
      createSystem({ scoringWeight: 2, name: "system-1" }),
      createSystem({ scoringWeight: 2, name: "system-2" })
    ];

    const { container } = render(
      <ThemeProvider>
        <RelatedSystems countryCode="en" systems={systems} />
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });
});

describe("SystemCard", () => {
  it("renders correctly with system from elasticsearch", () => {
    const system: EsSystem = createEsSystem();
    const gtm = { id: "gtm-id" };

    render(
      <ThemeProvider>
        <SystemCard
          system={system}
          systemPropertiesToDisplay={["Key Features"]}
          countryCode="en"
          path={system.path}
          gtm={gtm}
        />
      </ThemeProvider>
    );
    const systemPropertyContainer = screen.getByTestId("systemProperties");

    const propertyValues = system.systemAttributes[0].values.slice(0, 3);

    propertyValues.forEach((val) =>
      expect(within(systemPropertyContainer).getByText(val)).toBeInTheDocument()
    );
  });

  it("renders correctly with related system", () => {
    const system: RelatedSystem = createRelatedSystem();
    const gtm = { id: "gtm-id" };

    const { container } = render(
      <ThemeProvider>
        <SystemCard
          system={system}
          countryCode="en"
          path={system.path}
          gtm={gtm}
        />
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it("should render with masterImage", () => {
    const system: RelatedSystem = createRelatedSystem({
      name: "Fake system",
      masterImage: createPimImage({
        mainSource: "https://fake_master_image.jpg"
      })
    });

    render(
      <ThemeProvider>
        <SystemCard
          system={system}
          countryCode="en"
          path={system.path}
          gtm={{ id: "gtm-id" }}
        />
      </ThemeProvider>
    );
    expect(screen.getByAltText(system.name).getAttribute("src")).toBe(
      system.masterImage!.mainSource
    );
  });

  it("should take first gallery image if masterImage does not exist", () => {
    const system: RelatedSystem = createRelatedSystem({
      name: "Fake system",
      masterImage: undefined,
      galleryImages: [
        createPimImage({ mainSource: "https://fake_gallery_image.jpg" })
      ]
    });

    render(
      <ThemeProvider>
        <SystemCard
          system={system}
          countryCode="en"
          path={system.path}
          gtm={{ id: "gtm-id" }}
        />
      </ThemeProvider>
    );
    expect(screen.getByAltText(system.name).getAttribute("src")).toBe(
      system.galleryImages[0].mainSource
    );
  });

  it("works correctly if there is no images", () => {
    const system: RelatedSystem = createRelatedSystem({
      name: "Fake system",
      masterImage: undefined,
      galleryImages: []
    });

    render(
      <ThemeProvider>
        <SystemCard
          system={system}
          countryCode="en"
          path={system.path}
          gtm={{ id: "gtm-id" }}
        />
      </ThemeProvider>
    );
    expect(screen.queryByAltText(system.name)).not.toBeInTheDocument();
  });
});

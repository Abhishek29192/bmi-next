import {
  createSystem as createEsSystem,
  System as EsSystem
} from "@bmi/elasticsearch-types";
import { render } from "@testing-library/react";
import React from "react";
import { RelatedSystem, System } from "../../types/pim";
import createRelatedSystem from "../../__tests__/helpers/RelatedSystemHelper";
import createSystem from "../../__tests__/helpers/SystemHelper";
import RelatedSystems, { SystemCard } from "../RelatedSystems";

describe("RelatedSystems component", () => {
  it("renders correctly with no systems", () => {
    const systems: System[] = [];

    const { container } = render(
      <RelatedSystems countryCode="en" systems={systems} />
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly with systems", () => {
    const systems: System[] = [createSystem()];

    const { container } = render(
      <RelatedSystems countryCode="en" systems={systems} />
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly without categories", () => {
    const systems: System[] = [createSystem({ categories: null })];

    const { container } = render(
      <RelatedSystems countryCode="en" systems={systems} />
    );
    expect(container).toMatchSnapshot();
  });

  it("renders systems correctly without classifications", () => {
    const systems: System[] = [createSystem({ classifications: null })];

    const { container } = render(
      <RelatedSystems countryCode="en" systems={systems} />
    );
    expect(container).toMatchSnapshot();
  });
  it("renders correctly with scoringweight", () => {
    const systems: System[] = [
      createSystem({ scoringWeight: 2 }),
      createSystem({ scoringWeight: 3 })
    ];

    const { container } = render(
      <RelatedSystems countryCode="en" systems={systems} />
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly with scoringweight equal", () => {
    const systems: System[] = [
      createSystem({ scoringWeight: 2 }),
      createSystem({ scoringWeight: 2 })
    ];

    const { container } = render(
      <RelatedSystems countryCode="en" systems={systems} />
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly when scoringweight equal & names equal", () => {
    const systems: System[] = [
      createSystem({ scoringWeight: 2, name: "system-1" }),
      createSystem({ scoringWeight: 2, name: "system-1" })
    ];

    const { container } = render(
      <RelatedSystems countryCode="en" systems={systems} />
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly with scoringweight equal & names sorted opposite", () => {
    const systems: System[] = [
      createSystem({ scoringWeight: 2, name: "system-1" }),
      createSystem({ scoringWeight: 2, name: "system-2" })
    ];

    const { container } = render(
      <RelatedSystems countryCode="en" systems={systems} />
    );
    expect(container).toMatchSnapshot();
  });
});

describe("SystemCard", () => {
  it("renders correctly with system from elasticsearch", () => {
    const system: EsSystem = createEsSystem();
    const gtm = { id: "gtm-id" };

    const { container } = render(
      <SystemCard
        system={system}
        countryCode="en"
        path={system.path}
        gtm={gtm}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly with related system", () => {
    const system: RelatedSystem = createRelatedSystem();
    const gtm = { id: "gtm-id" };

    const { container } = render(
      <SystemCard
        system={system}
        countryCode="en"
        path={system.path}
        gtm={gtm}
      />
    );
    expect(container).toMatchSnapshot();
  });
});

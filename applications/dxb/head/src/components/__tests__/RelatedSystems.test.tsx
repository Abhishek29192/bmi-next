import React from "react";
import { render } from "@testing-library/react";
import RelatedSystems from "../RelatedSystems";
import { SystemDetails } from "../../templates/systemDetails/types";

describe("RelatedSystems component", () => {
  it("renders correctly with no systems", () => {
    const systems: SystemDetails[] = [];

    const { container } = render(
      <RelatedSystems countryCode="en" systems={systems} />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders correctly with systems", () => {
    const systems: SystemDetails[] = [
      {
        assets: null,
        longDescription: null,
        systemBenefits: null,
        categories: [
          {
            categoryType: "Brand",
            code: "MONARFLX",
            name: "Monarflex"
          }
        ],
        classifications: [
          {
            code: "ScoringWeightAttributes",
            features: [
              {
                code: "bmiSystemsClassificationCatalog/1.0/ScoringWeightAttributes.scoring_weight",
                featureValues: [
                  {
                    value: "2"
                  }
                ],
                name: "Scoring Weight"
              }
            ],
            name: "Scoring Weight Attributes"
          }
        ],
        code: "Test_PIM_System1",
        images: null,
        name: "NO System 1",
        shortDescription: "SDescription 1 NO",
        path: "/s/test"
      }
    ];

    const { container } = render(
      <RelatedSystems countryCode="en" systems={systems} />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders correctly without categories", () => {
    const systems: SystemDetails[] = [
      {
        assets: null,
        longDescription: null,
        systemBenefits: null,
        categories: [],
        classifications: [
          {
            code: "ScoringWeightAttributes",
            features: [
              {
                code: "bmiSystemsClassificationCatalog/1.0/ScoringWeightAttributes.scoring_weight",
                featureValues: [
                  {
                    value: "2"
                  }
                ],
                name: "Scoring Weight"
              }
            ],
            name: "Scoring Weight Attributes"
          }
        ],
        code: "Test_PIM_System1",
        images: null,
        name: "NO System 1",
        shortDescription: "SDescription 1 NO",
        path: "/s/test"
      }
    ];

    const { container } = render(
      <RelatedSystems countryCode="en" systems={systems} />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders systems correctly without classifications", () => {
    const systems: SystemDetails[] = [
      {
        assets: null,
        longDescription: null,
        systemBenefits: null,
        categories: [
          {
            categoryType: "Brand",
            code: "MONARFLX",
            name: "Monarflex"
          }
        ],
        classifications: [],
        code: "Test_PIM_System1",
        images: null,
        name: "NO System 1",
        shortDescription: "SDescription 1 NO",
        path: "/s/test"
      }
    ];

    const { container } = render(
      <RelatedSystems countryCode="en" systems={systems} />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders correctly with scoringweight", () => {
    const systems: SystemDetails[] = [
      {
        assets: null,
        longDescription: null,
        systemBenefits: null,
        categories: [
          {
            categoryType: "Brand",
            code: "MONARFLX",
            name: "Monarflex"
          }
        ],
        classifications: [
          {
            code: "ScoringWeightAttributes",
            features: [
              {
                code: "bmiSystemsClassificationCatalog/1.0/ScoringWeightAttributes.scoring_weight",
                featureValues: [
                  {
                    value: "2"
                  }
                ],
                name: "Scoring Weight"
              }
            ],
            name: "Scoring Weight Attributes"
          }
        ],
        code: "Test_PIM_System1",
        images: null,
        name: "NO System 1",
        shortDescription: "SDescription 1 NO",
        path: "/s/test"
      },
      {
        assets: null,
        longDescription: null,
        systemBenefits: null,
        categories: [
          {
            categoryType: "Brand",
            code: "MONARFLX",
            name: "Monarflex"
          }
        ],
        classifications: [
          {
            code: "ScoringWeightAttributes",
            features: [
              {
                code: "bmiSystemsClassificationCatalog/1.0/ScoringWeightAttributes.scoring_weight",
                featureValues: [
                  {
                    value: "3"
                  }
                ],
                name: "Scoring Weight"
              }
            ],
            name: "Scoring Weight Attributes"
          }
        ],
        code: "Test_PIM_System2",
        images: null,
        name: "NO System 2",
        shortDescription: "SDescription 1 NO",
        path: "/s/test2"
      }
    ];

    const { container } = render(
      <RelatedSystems countryCode="en" systems={systems} />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders correctly with scoringweight equal", () => {
    const systems: SystemDetails[] = [
      {
        assets: null,
        longDescription: null,
        systemBenefits: null,
        categories: [
          {
            categoryType: "Brand",
            code: "MONARFLX",
            name: "Monarflex"
          }
        ],
        classifications: [
          {
            code: "ScoringWeightAttributes",
            features: [
              {
                code: "bmiSystemsClassificationCatalog/1.0/ScoringWeightAttributes.scoring_weight",
                featureValues: [
                  {
                    value: "2"
                  }
                ],
                name: "Scoring Weight"
              }
            ],
            name: "Scoring Weight Attributes"
          }
        ],
        code: "Test_PIM_System1",
        images: null,
        name: "NO System 1",
        shortDescription: "SDescription 1 NO",
        path: "/s/test"
      },
      {
        assets: null,
        longDescription: null,
        systemBenefits: null,
        categories: [
          {
            categoryType: "Brand",
            code: "MONARFLX",
            name: "Monarflex"
          }
        ],
        classifications: [
          {
            code: "ScoringWeightAttributes",
            features: [
              {
                code: "bmiSystemsClassificationCatalog/1.0/ScoringWeightAttributes.scoring_weight",
                featureValues: [
                  {
                    value: "2"
                  }
                ],
                name: "Scoring Weight"
              }
            ],
            name: "Scoring Weight Attributes"
          }
        ],
        code: "Test_PIM_System2",
        images: null,
        name: "NO System 2",
        shortDescription: "SDescription 1 NO",
        path: "/s/test2"
      }
    ];

    const { container } = render(
      <RelatedSystems countryCode="en" systems={systems} />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders correctly when scoringweight equal & names equal", () => {
    const systems: SystemDetails[] = [
      {
        assets: null,
        longDescription: null,
        systemBenefits: null,
        categories: [
          {
            categoryType: "Brand",
            code: "MONARFLX",
            name: "Monarflex"
          }
        ],
        classifications: [
          {
            code: "ScoringWeightAttributes",
            features: [
              {
                code: "bmiSystemsClassificationCatalog/1.0/ScoringWeightAttributes.scoring_weight",
                featureValues: [
                  {
                    value: "2"
                  }
                ],
                name: "Scoring Weight"
              }
            ],
            name: "Scoring Weight Attributes"
          }
        ],
        code: "Test_PIM_System1",
        images: null,
        name: "NO System 1",
        shortDescription: "SDescription 1 NO",
        path: "/s/test"
      },
      {
        assets: null,
        longDescription: null,
        systemBenefits: null,
        categories: [
          {
            categoryType: "Brand",
            code: "MONARFLX",
            name: "Monarflex"
          }
        ],
        classifications: [
          {
            code: "ScoringWeightAttributes",
            features: [
              {
                code: "bmiSystemsClassificationCatalog/1.0/ScoringWeightAttributes.scoring_weight",
                featureValues: [
                  {
                    value: "2"
                  }
                ],
                name: "Scoring Weight"
              }
            ],
            name: "Scoring Weight Attributes"
          }
        ],
        code: "Test_PIM_System2",
        images: null,
        name: "NO System 1",
        shortDescription: "SDescription 1 NO",
        path: "/s/test2"
      }
    ];

    const { container } = render(
      <RelatedSystems countryCode="en" systems={systems} />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders correctly with scoringweight equal & names sorted opposite", () => {
    const systems: SystemDetails[] = [
      {
        assets: null,
        longDescription: null,
        systemBenefits: null,
        categories: [
          {
            categoryType: "Brand",
            code: "MONARFLX",
            name: "Monarflex"
          }
        ],
        classifications: [
          {
            code: "ScoringWeightAttributes",
            features: [
              {
                code: "bmiSystemsClassificationCatalog/1.0/ScoringWeightAttributes.scoring_weight",
                featureValues: [
                  {
                    value: "2"
                  }
                ],
                name: "Scoring Weight"
              }
            ],
            name: "Scoring Weight Attributes"
          }
        ],
        code: "Test_PIM_System1",
        images: null,
        name: "NO System 2",
        shortDescription: "SDescription 1 NO",
        path: "/s/test"
      },
      {
        assets: null,
        longDescription: null,
        systemBenefits: null,
        categories: [
          {
            categoryType: "Brand",
            code: "MONARFLX",
            name: "Monarflex"
          }
        ],
        classifications: [
          {
            code: "ScoringWeightAttributes",
            features: [
              {
                code: "bmiSystemsClassificationCatalog/1.0/ScoringWeightAttributes.scoring_weight",
                featureValues: [
                  {
                    value: "2"
                  }
                ],
                name: "Scoring Weight"
              }
            ],
            name: "Scoring Weight Attributes"
          }
        ],
        code: "Test_PIM_System2",
        images: null,
        name: "NO System 1",
        shortDescription: "SDescription 1 NO",
        path: "/s/test2"
      }
    ];

    const { container } = render(
      <RelatedSystems countryCode="en" systems={systems} />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});

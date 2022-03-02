import React from "react";
import { render } from "@testing-library/react";
import RelatedSystems from "../RelatedSystems";
import { ClassificationCodeEnum, System } from "../types/pim";

describe("RelatedSystems component", () => {
  it("renders correctly with no systems", () => {
    const systems: System[] = [];

    const { container } = render(
      <RelatedSystems countryCode="en" systems={systems} />
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly with systems", () => {
    const systems: System[] = [
      {
        approvalStatus: "approved",
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
            code: ClassificationCodeEnum.SCORING_WEIGHT_ATTRIBUTES,
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
            name: ClassificationCodeEnum.SCORING_WEIGHT_ATTRIBUTES
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
    expect(container).toMatchSnapshot();
  });

  it("renders correctly without categories", () => {
    const systems: System[] = [
      {
        approvalStatus: "approved",
        assets: null,
        longDescription: null,
        systemBenefits: null,
        categories: [],
        classifications: [
          {
            code: ClassificationCodeEnum.SCORING_WEIGHT_ATTRIBUTES,
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
            name: ClassificationCodeEnum.SCORING_WEIGHT_ATTRIBUTES
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
    expect(container).toMatchSnapshot();
  });

  it("renders systems correctly without classifications", () => {
    const systems: System[] = [
      {
        approvalStatus: "approved",
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
    expect(container).toMatchSnapshot();
  });
  it("renders correctly with scoringweight", () => {
    const systems: System[] = [
      {
        approvalStatus: "approved",
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
            code: ClassificationCodeEnum.SCORING_WEIGHT_ATTRIBUTES,
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
            name: ClassificationCodeEnum.SCORING_WEIGHT_ATTRIBUTES
          }
        ],
        code: "Test_PIM_System1",
        images: null,
        name: "NO System 1",
        shortDescription: "SDescription 1 NO",
        path: "/s/test"
      },
      {
        approvalStatus: "approved",
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
            code: ClassificationCodeEnum.SCORING_WEIGHT_ATTRIBUTES,
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
            name: ClassificationCodeEnum.SCORING_WEIGHT_ATTRIBUTES
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
    expect(container).toMatchSnapshot();
  });

  it("renders correctly with scoringweight equal", () => {
    const systems: System[] = [
      {
        approvalStatus: "approved",
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
            code: ClassificationCodeEnum.SCORING_WEIGHT_ATTRIBUTES,
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
            name: ClassificationCodeEnum.SCORING_WEIGHT_ATTRIBUTES
          }
        ],
        code: "Test_PIM_System1",
        images: null,
        name: "NO System 1",
        shortDescription: "SDescription 1 NO",
        path: "/s/test"
      },
      {
        approvalStatus: "approved",
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
            code: ClassificationCodeEnum.SCORING_WEIGHT_ATTRIBUTES,
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
            name: ClassificationCodeEnum.SCORING_WEIGHT_ATTRIBUTES
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
    expect(container).toMatchSnapshot();
  });

  it("renders correctly when scoringweight equal & names equal", () => {
    const systems: System[] = [
      {
        approvalStatus: "approved",
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
            code: ClassificationCodeEnum.SCORING_WEIGHT_ATTRIBUTES,
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
            name: ClassificationCodeEnum.SCORING_WEIGHT_ATTRIBUTES
          }
        ],
        code: "Test_PIM_System1",
        images: null,
        name: "NO System 1",
        shortDescription: "SDescription 1 NO",
        path: "/s/test"
      },
      {
        approvalStatus: "approved",
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
            code: ClassificationCodeEnum.SCORING_WEIGHT_ATTRIBUTES,
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
            name: ClassificationCodeEnum.SCORING_WEIGHT_ATTRIBUTES
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
    expect(container).toMatchSnapshot();
  });

  it("renders correctly with scoringweight equal & names sorted opposite", () => {
    const systems: System[] = [
      {
        approvalStatus: "approved",
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
            code: ClassificationCodeEnum.SCORING_WEIGHT_ATTRIBUTES,
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
            name: ClassificationCodeEnum.SCORING_WEIGHT_ATTRIBUTES
          }
        ],
        code: "Test_PIM_System1",
        images: null,
        name: "NO System 2",
        shortDescription: "SDescription 1 NO",
        path: "/s/test"
      },
      {
        approvalStatus: "approved",
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
            code: ClassificationCodeEnum.SCORING_WEIGHT_ATTRIBUTES,
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
            name: ClassificationCodeEnum.SCORING_WEIGHT_ATTRIBUTES
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
    expect(container).toMatchSnapshot();
  });
});
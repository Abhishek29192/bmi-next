import { ApprovalStatus, createCategory } from "@bmi/pim-types";
import { Image, System } from "./types";

const createSystemImage = (): Image => ({
  mainSource: "http://localhost:8000/mainSource",
  thumbnail: "http://localhost:8000/thumbnail",
  altText: "Alt text"
});

const createSystem = (esSystem?: Partial<System>): System => ({
  approvalStatus: ApprovalStatus.Approved,
  brand: createCategory({}),
  code: "code",
  hashedCode: "hashed-code",
  galleryImages: [createSystemImage()],
  name: "name",
  path: "/s/code-name-hashed-code",
  scoringWeight: 1,
  systemAttributes: [
    {
      code: "bmiSystemsClassificationCatalog/1.0/systemAttributes.KeyFeatures",
      name: "Key Features",
      values: [
        "Robust and waterproof steel",
        "1000 year warranty",
        "Best system on the globe",
        "No other systems like this"
      ]
    },
    {
      code: "bmiSystemsClassificationCatalog/1.0/systemAttributes.roofBuildUp",
      values: [
        "Combines self-adhesive/heat activated and torch applied installation techniques"
      ],
      name: "Roof build-up"
    },
    {
      code: "bmiSystemsClassificationCatalog/1.0/systemAttributes.UniqueSellingPropositions",
      name: "Unique Selling Propositions",
      values: [
        "Slippery when wet, which makes it difficult for pigeons to sit on",
        "Keeps the rain off so that your hair doesn't get messed up",
        "Comes in a range of colours so that your house really stands out and looks better than that rubbish roof next door",
        "Part of a robust construction that makes it impossible for wolves to blow down",
        "One of the best in the market"
      ]
    },
    {
      code: "bmiSystemsClassificationCatalog/1.0/systemAttributes.PromotionalContent",
      values: [
        "Promotional Content - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam maximus, turpis a feugiat ultricies, tortor velit fringilla lorem, at vulputate erat diam ac eros. Nam vestibulum suscipit mi, rutrum laoreet nulla fermentum sed. Praesent a justo eget velit consectetur vestibulum sed vel ante. Phasellus vel lectus pharetra, blandit sapien in, venenatis mi. Maecenas ultrices lobortis enim, ac condimentum lorem ullamcorper a. Maecenas id auctor nibh. Pellentesque finibus efficitur felis in tristique. Nullam condimentum placerat augue, in congue orci pretium in. Curabitur at dui ante."
      ],
      name: "Promotional Content"
    }
  ],
  shortDescription: "Short description",
  type: "systemWsDTO",
  ...esSystem
});

export default createSystem;

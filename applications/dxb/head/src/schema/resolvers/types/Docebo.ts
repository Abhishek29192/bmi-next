import type { Course } from "@bmi/gatsby-source-docebo";
import type { Node } from "gatsby";

export type GatsbyTrainingNode = Course &
  Node & {
    internal: {
      type: "DoceboCourses";
      contentDigest: string;
      owner: "@bmi/gatsby-source-docebo";
      counter: number;
    };
  };

import { FlatRoof, OtherTraining, PitchedRoof } from "@bmi-digital/components";
import { Technology } from "@bmi/intouch-api-types";
import React from "react";
import { TrainingQuery } from "../../graphql/generated/operations";

export const technologyIcon: {
  [K in Technology]: React.FC<React.SVGProps<SVGSVGElement>>;
} = {
  FLAT: FlatRoof,
  PITCHED: PitchedRoof,
  OTHER: OtherTraining
};

export const technologyNames: { [K in Technology]: string } = {
  FLAT: "technology.FLAT",
  PITCHED: "technology.PITCHED",
  OTHER: "technology.OTHER"
};

const technologies: Technology[] = ["FLAT", "PITCHED", "OTHER"];
export const getTechnology = (technology: string): Technology | undefined =>
  technologies.find((tech) => tech === technology?.toUpperCase());

export const sortCourses = (
  nodes: TrainingQuery["courseCatalogues"]["nodes"]
) =>
  [...nodes].sort((a, b) => {
    return (
      a.course?.trainingType?.localeCompare(b?.course?.trainingType) ||
      a.course?.name?.localeCompare(b?.course?.name)
    );
  });

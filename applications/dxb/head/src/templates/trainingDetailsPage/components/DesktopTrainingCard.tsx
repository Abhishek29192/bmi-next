import { microCopy } from "@bmi/microcopies";
import React from "react";
import { useSiteContext } from "../../../components/Site";
import { trainingCategoryMicroCopies } from "../../../constants/trainingCategoryMicroCopies";
import { trainingTypeMicroCopies } from "../../../constants/trainingTypeMicroCopies";
import { getPriceLabel } from "../../../utils/trainingUtils";
import getCategoryType from "../../../utils/getCategoryType";
import { StyledTrainingCard } from "../trainingDetailsPageStyles";
import type { TrainingDetailsCourseType as Course } from "../types";

export type DesktopTrainingCardProps = Pick<
  Course,
  | "name"
  | "categoryName"
  | "code"
  | "price"
  | "currencySymbol"
  | "course_type"
  | "img_url"
> & {
  sessionsContainerId: string;
};

const DesktopTrainingCard = ({
  name,
  code,
  price,
  currencySymbol,
  categoryName,
  course_type,
  img_url,
  sessionsContainerId
}: DesktopTrainingCardProps) => {
  const { getMicroCopy } = useSiteContext();

  return (
    <StyledTrainingCard
      title={name}
      subtitle={`${getMicroCopy(microCopy.TRAINING_CODE_LABEL)} ${code}`}
      media={<img src={img_url} alt={name} />}
      price={getPriceLabel(
        price,
        currencySymbol,
        getMicroCopy(microCopy.TRAINING_PRICE_FREE)
      )}
      category={{
        type: getCategoryType(categoryName),
        // eslint-disable-next-line security/detect-object-injection
        label: getMicroCopy(trainingCategoryMicroCopies[categoryName])
      }}
      trainingType={{
        type: course_type,
        // eslint-disable-next-line security/detect-object-injection
        label: getMicroCopy(trainingTypeMicroCopies[course_type])
      }}
      ctaLabel={getMicroCopy(
        microCopy.TRAINING_DETAILS_SEE_AVAILABLE_SESSIONS_BUTTON
      )}
      href={`#${sessionsContainerId}`}
    />
  );
};

export default DesktopTrainingCard;

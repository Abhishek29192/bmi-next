import Typography from "@bmi-digital/components/typography";
import { microCopy } from "@bmi/microcopies";
import TollOutlined from "@bmi-digital/components/icon/TollOutlined";
import React from "react";
import { useSiteContext } from "../../../components/Site";
import { getPriceLabel } from "../../../utils/trainingUtils";
import { trainingCategoriesIcon } from "../../../constants/trainingCategoriesIcon";
import { trainingTypeIcon } from "../../../constants/trainingTypeIcon";
import { trainingCategoryMicroCopies } from "../../../constants/trainingCategoryMicroCopies";
import { trainingTypeMicroCopies } from "../../../constants/trainingTypeMicroCopies";
import {
  StyledIcon,
  StyledImg,
  TrainingAttribute
} from "./MobileTrainingInfoStyles";
import type { TrainingDetailsCourseType as Course } from "../types";

export type MobileTrainingInfoProps = Pick<
  Course,
  | "name"
  | "categoryName"
  | "code"
  | "price"
  | "currencySymbol"
  | "course_type"
  | "img_url"
>;

const MobileTrainingInfo = (props: MobileTrainingInfoProps) => {
  const { getMicroCopy } = useSiteContext();

  return (
    <div data-testid="training-info-section">
      <StyledImg
        alt={props.name}
        src={props.img_url}
        data-testid="training-image"
      />
      <Typography variant="h1" data-testid="training-name" hasUnderline>
        {props.name}
      </Typography>
      <Typography variant="h5" data-testid="training-code">
        {getMicroCopy(microCopy.TRAINING_CODE_LABEL)} {props.code}
      </Typography>
      <TrainingAttribute data-testid="training-category" variant="h6">
        <StyledIcon source={trainingCategoriesIcon[props.categoryName]} />
        {getMicroCopy(trainingCategoryMicroCopies[props.categoryName])}
      </TrainingAttribute>
      <TrainingAttribute data-testid="training-type" variant="h6">
        <StyledIcon source={trainingTypeIcon[props.course_type]} />
        {getMicroCopy(trainingTypeMicroCopies[props.course_type])}
      </TrainingAttribute>
      <TrainingAttribute data-testid="training-price" variant="h6">
        <StyledIcon source={TollOutlined} />
        {getPriceLabel(
          props.price,
          props.currencySymbol,
          getMicroCopy(microCopy.TRAINING_PRICE_FREE)
        )}
      </TrainingAttribute>
    </div>
  );
};

export default MobileTrainingInfo;

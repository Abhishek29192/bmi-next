import React from "react";
import { microCopy, MicroCopyValues } from "@bmi/microcopies";
import {
  trainingCategoriesIcon,
  trainingTypeIcon
} from "@bmi-digital/components/training-card";
import Section from "@bmi-digital/components/section";
import { Price, Calender } from "@bmi-digital/components/icon";
import { Training } from "@bmi/elasticsearch-types";
import { useSiteContext } from "../../../components/Site";
import {
  TrainingDataContainer,
  TrainingLabel,
  TrainingDesc,
  TrainingDetailContainer,
  TrainingSeparation,
  StyledIcon
} from "../trainingRegistrationPageStyles";
import { trainingCategoryMicroCopies } from "../../../constants/trainingConstants";
import { useConfig } from "../../../contexts/ConfigProvider";

type Props = {
  training: Training;
};

const TrainingRegistrationHeader = ({ training }: Props) => {
  const {
    name,
    courseId,
    courseType,
    category,
    currencySymbol,
    onSale,
    startDate,
    price
  } = training;
  const { getMicroCopy } = useSiteContext();
  const { marketLocaleCode } = useConfig();

  const formatDate = (inputDateString: string) =>
    new Intl.DateTimeFormat(marketLocaleCode, {
      year: "numeric",
      month: "long",
      day: "numeric"
    }).format(new Date(inputDateString));

  return (
    <Section backgroundColor="pearl">
      <Section.Title
        variant="h1"
        data-testid="training-registration-page-header-title"
      >
        {`${name} ${getMicroCopy(microCopy.TRAINING_REGISTRATION)}`}
      </Section.Title>

      <TrainingDataContainer>
        <TrainingDetailContainer>
          <TrainingLabel>
            {getMicroCopy(microCopy.TRAINING_ID_LABEL)}
          </TrainingLabel>
          <TrainingDesc data-testid="training-id">{courseId}</TrainingDesc>
        </TrainingDetailContainer>
        <TrainingSeparation />
        <TrainingDetailContainer>
          <TrainingLabel>
            {getMicroCopy(microCopy.FILTER_LABELS_CATEGORY)}
          </TrainingLabel>
          <TrainingDesc data-testid="training-category">
            <StyledIcon
              source={trainingCategoriesIcon[category.toUpperCase()]}
            />
            {getMicroCopy(trainingCategoryMicroCopies[category.toUpperCase()])}
          </TrainingDesc>
        </TrainingDetailContainer>
        <TrainingSeparation />
        <TrainingDetailContainer>
          <TrainingLabel>
            {getMicroCopy(microCopy.TRAINING_REGISTRATION_TYPE)}
          </TrainingLabel>
          <TrainingDesc data-testid="training-type">
            <StyledIcon source={trainingTypeIcon[String(courseType)]} />
            {getMicroCopy(`trainingType.${courseType}` as MicroCopyValues)}
          </TrainingDesc>
        </TrainingDetailContainer>
        <TrainingSeparation />
        <TrainingDetailContainer>
          <TrainingLabel>
            {getMicroCopy(microCopy.TRAINING_REGISTRATION_COST)}
          </TrainingLabel>
          <TrainingDesc data-testid="training-price">
            <StyledIcon source={Price} />
            {onSale
              ? `${currencySymbol}${price}`
              : getMicroCopy(microCopy.TRAINING_PRICE_FREE)}
          </TrainingDesc>
        </TrainingDetailContainer>
        {startDate && (
          <>
            <TrainingSeparation />
            <TrainingDetailContainer>
              <TrainingLabel>
                {getMicroCopy(microCopy.TRAINING_REGISTRATION_DATE)}
              </TrainingLabel>
              <TrainingDesc data-testid="training-start-date">
                <StyledIcon source={Calender} />
                {formatDate(startDate)}
              </TrainingDesc>
            </TrainingDetailContainer>
          </>
        )}
      </TrainingDataContainer>
    </Section>
  );
};

export default TrainingRegistrationHeader;

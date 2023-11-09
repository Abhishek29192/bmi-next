import React, { useEffect, useState, useMemo, useCallback } from "react";
import { MicroCopyValues, microCopy } from "@bmi/microcopies";
import { Grid, TrainingCard } from "@bmi-digital/components";
import { ButtonBase } from "@mui/material";
import AddIcon from "@bmi-digital/components/icon/Add";
import RemoveIcon from "@bmi-digital/components/icon/Remove";
import { Training } from "@bmi/elasticsearch-types";
import { useSiteContext } from "../../../components/Site";
import { getPathWithCountryCode } from "../../../utils/path";
import { SHOW_MORE_LIMIT } from "../constants";
import {
  Description,
  ItemsCount,
  ShowMoreButton,
  Title,
  TrainingCatalogueWrapper
} from "./training-catalogue-styles";

export const trainingCategoriesName: { [key: string]: MicroCopyValues } = {
  FLAT: microCopy.TRAINING_CATEGORY_FLAT,
  PITCHED: microCopy.TRAINING_CATEGORY_PITCHED,
  OTHER: microCopy.TRAINING_CATEGORY_OTHER
};

export type Props = {
  courses: Training[];
  defaultImageUrl?: string;
  countryCode: string;
  fetchPaginatedTrainings: (catalogueId: string, from: number) => Promise<void>;
  collapseCatalogueCourses: (catalogueId: string) => void;
  total: number;
};

const TrainingCatalogue = ({
  countryCode,
  courses,
  defaultImageUrl,
  collapseCatalogueCourses,
  fetchPaginatedTrainings,
  total
}: Props) => {
  const [count, setCount] = useState<number>(SHOW_MORE_LIMIT);
  const { getMicroCopy } = useSiteContext();
  const catalogueData = useMemo(
    () => ({
      id: courses[0].catalogueId,
      name: courses[0].catalogueName,
      description: courses[0].catalogueDescription
    }),
    [courses]
  );

  useEffect(() => {
    return () => {
      setCount(SHOW_MORE_LIMIT);
    };
  }, [total]);

  const handleShowMore = useCallback(async () => {
    const showMore = count < total;

    if (showMore) {
      let newCount = count + SHOW_MORE_LIMIT;
      fetchPaginatedTrainings(catalogueData.id, count);
      newCount = newCount < total ? newCount : total;
      setCount(newCount);
    } else {
      collapseCatalogueCourses(catalogueData.id);
      setCount(SHOW_MORE_LIMIT);
    }
  }, [
    count,
    catalogueData,
    fetchPaginatedTrainings,
    collapseCatalogueCourses,
    total
  ]);

  const showMoreButton = useMemo(() => {
    const showMore = count < total;

    const buttonLabel = showMore
      ? microCopy.TRAINING_CATALOGUE_SHOW_MORE
      : microCopy.TRAINING_CATALOGUE_SHOW_LESS;
    const ButtonIcon = showMore ? AddIcon : RemoveIcon;
    const dataTestId = `show-${showMore ? "more" : "less"}-trainings-button`;

    return (
      <ShowMoreButton
        onClick={handleShowMore}
        variant="outlined"
        endIcon={<ButtonIcon />}
        data-testid={dataTestId}
      >
        {getMicroCopy(buttonLabel)}
      </ShowMoreButton>
    );
  }, [count, getMicroCopy, handleShowMore, total]);

  return (
    <TrainingCatalogueWrapper>
      <Title variant="h4" hasUnderline data-testid="catalogue-title">
        {catalogueData.name}
      </Title>
      {catalogueData.description && (
        <Description data-testid="catalogue-description">
          {/** removes html tags from the description*/}
          {catalogueData.description.replace(/(<([^>]+)>)/gi, "")}
        </Description>
      )}
      <ItemsCount data-testid={`catalogue-trainings-count`}>
        <strong>
          {getMicroCopy(microCopy.TRAINING_LISTER_PAGE_TRAINING_COUNT, {
            count: total.toString()
          })}
        </strong>{" "}
        {getMicroCopy(microCopy.TRAINING_LISTER_PAGE_IN)} {catalogueData.name}
      </ItemsCount>
      <Grid container spacing={3}>
        {courses.map((training) => (
          <Grid
            xs={12}
            md={6}
            lg={4}
            key={`${catalogueData.id}-${training.slug}`}
          >
            <TrainingCard
              buttonComponent={(props) => (
                <ButtonBase
                  {...props}
                  data-testid="training-card"
                  href={getPathWithCountryCode(
                    countryCode,
                    `/t/${training.slug}`
                  )}
                />
              )}
              category={{
                type: training.category,
                label: getMicroCopy(
                  trainingCategoriesName[training.category.toUpperCase()]
                )
              }}
              title={training.name}
              subtitle={`${getMicroCopy(microCopy.TRAINING_ID_LABEL)} ${
                training.code
              }`}
              trainingType={{
                type: training.courseType,
                label: getMicroCopy(
                  `trainingType.${training.courseType}` as MicroCopyValues
                )
              }}
              media={
                <img
                  data-testid="training-preview-image"
                  src={training.imgUrl || defaultImageUrl}
                  alt={training.name}
                />
              }
              viewTrainingLabel={getMicroCopy(
                microCopy.TRAINING_LISTER_PAGE_VIEW_TRAINING
              )}
            />
          </Grid>
        ))}
      </Grid>
      {total > SHOW_MORE_LIMIT && showMoreButton}
    </TrainingCatalogueWrapper>
  );
};

export default TrainingCatalogue;

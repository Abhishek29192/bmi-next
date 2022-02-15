import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Typography from "@bmi-digital/components/typography";
import { Technology } from "@bmi/intouch-api-types";
import Icon from "@bmi-digital/components/icon";
import { FilterResult } from "../../FilterResult";
import { SidePanel } from "../";
import { TrainingQuery } from "../../../graphql/generated/operations";
import { getTechnology, technologyIcon } from "../../../lib/utils/course";
import styles from "./styles.module.scss";

const DEFAULT_FILTER_CRITERIA = "all";

type TrainingSidePanelProps = {
  courseCatalog?: TrainingQuery["courseCatalogues"]["nodes"];
  onCourseSelected?: (courseId: number) => void;
  onFilterChange?: () => void;
};

export const TrainingSidePanel = ({
  courseCatalog,
  onCourseSelected,
  onFilterChange
}: TrainingSidePanelProps) => {
  const { t } = useTranslation(["common", "training-page"]);
  const courseTech: { [K in Technology]: string } = {
    FLAT: t("common:certifications.flat"),
    PITCHED: t("common:certifications.pitched"),
    OTHER: t("common:certifications.other")
  };

  const trainingFilters = [
    {
      label: t("training-page:filter.labels.all"),
      attr: DEFAULT_FILTER_CRITERIA,
      isActive: false
    },
    ...Object.entries(courseTech).map(([key, label]) => ({
      label,
      attr: key.toLowerCase(),
      isActive: false
    }))
  ];

  const [filterCriteria, setFilterCriteria] = useState<string>(
    DEFAULT_FILTER_CRITERIA
  );
  const [searchCriteria, setSearchCriteria] = useState<string>(undefined);

  const trainingFilterClickHandler = ({ attr }) => {
    setFilterCriteria(attr);
    onFilterChange && onFilterChange();
  };

  trainingFilters.forEach(
    (item) => (item.isActive = item.attr === filterCriteria)
  );
  const courses = courseCatalog.filter(
    ({ course: { name, technology } }) =>
      (filterCriteria === DEFAULT_FILTER_CRITERIA ||
        (technology && technology.toLowerCase() === filterCriteria)) &&
      (!searchCriteria ||
        name.toLowerCase().includes(searchCriteria.toLowerCase()))
  );

  return (
    <SidePanel
      searchLabel={t("training-page:search.inputLabel")}
      filters={trainingFilters}
      filterClick={trainingFilterClickHandler}
      onSearchFilterChange={(filter: string) => {
        setSearchCriteria(filter);
      }}
    >
      {courses.map(
        ({
          course: {
            courseId,
            name,
            technology: courseTechnology,
            trainingType,
            courseEnrollments
          }
        }) => {
          const technology = getTechnology(courseTechnology);
          return (
            <FilterResult
              label={name}
              key={name}
              onClick={() => {
                onCourseSelected && onCourseSelected(courseId);
              }}
              testId="filterResult"
            >
              <Typography style={{ textTransform: "capitalize" }}>
                {t(`training-page:type.${trainingType}`)}
              </Typography>
              <Typography className={styles.icon}>
                {technology && (
                  <Icon
                    // eslint-disable-next-line security/detect-object-injection
                    source={technologyIcon[technology]}
                    className={styles.technologyIcon}
                  />
                )}
                {t(`training-page:${courseEnrollments.nodes[0]?.status || ""}`)}
              </Typography>
            </FilterResult>
          );
        }
      )}
    </SidePanel>
  );
};

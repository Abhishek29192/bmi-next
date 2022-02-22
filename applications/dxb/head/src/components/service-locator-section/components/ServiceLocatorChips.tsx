import { Grid } from "@bmi/components";
import { Typography } from "@bmi/components";
import { Chip } from "@bmi/components";
import camelCase from "lodash-es/camelCase";
import React from "react";
import styles from "../styles/ServiceLocatorSection.module.scss";
import { useSiteContext } from "../../Site";
import { ServiceType, ServiceTypesPrefixesEnum } from "../../Service";

interface ServiceLocatorChipsProps {
  microCopyPrefix: ServiceTypesPrefixesEnum;
  onChipClick: (serviceType) => void;
  activeFilters: Record<ServiceType, boolean>;
  uniqueRoofTypeByData: ServiceType[];
}

export const ServiceLocatorChips = ({
  onChipClick,
  uniqueRoofTypeByData,
  microCopyPrefix,
  activeFilters
}: ServiceLocatorChipsProps) => {
  const { getMicroCopy } = useSiteContext();
  return (
    <Grid item xs={12} md={6} lg={8}>
      <div className={styles["filters"]}>
        <div className={styles["chips"]}>
          <Typography variant="h6" className={styles["chips-label"]}>
            {getMicroCopy(`${microCopyPrefix}.filtersLabel`)}
          </Typography>
          {uniqueRoofTypeByData.map((serviceType, index) => (
            <Chip
              key={index}
              type="selectable"
              onClick={() => onChipClick(serviceType)}
              // eslint-disable-next-line security/detect-object-injection
              isSelected={activeFilters[serviceType]}
            >
              {getMicroCopy(
                `${microCopyPrefix}.filters.${camelCase(serviceType)}`
              )}
            </Chip>
          ))}
        </div>
      </div>
    </Grid>
  );
};

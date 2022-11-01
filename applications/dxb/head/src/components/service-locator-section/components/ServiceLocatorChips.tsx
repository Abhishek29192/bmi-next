import { Chip, ChipProps, Grid, Typography } from "@bmi-digital/components";
import React from "react";
import withGTM from "../../../utils/google-tag-manager";
import { ServiceTypeFilter, ServiceTypesPrefixesEnum } from "../../Service";
import { Data as ServiceType } from "../../ServiceType";
import { useSiteContext } from "../../Site";
import styles from "../styles/ServiceLocatorSection.module.scss";

interface ServiceLocatorChipsProps {
  microCopyPrefix: ServiceTypesPrefixesEnum;
  onChipClick: (serviceType) => void;
  activeFilters: ServiceTypeFilter;
  uniqueRoofTypeByData: ServiceType[];
}

export const ServiceLocatorChips = ({
  onChipClick,
  uniqueRoofTypeByData,
  microCopyPrefix,
  activeFilters
}: ServiceLocatorChipsProps): React.ReactElement => {
  const { getMicroCopy } = useSiteContext();
  const GTMChip = withGTM<ChipProps>(Chip);

  return (
    <Grid item xs={12} md={6} lg={8}>
      <div className={styles["filters"]}>
        <div className={styles["chips"]}>
          <Typography variant="h6" className={styles["chips-label"]}>
            {getMicroCopy(`${microCopyPrefix}.filtersLabel`)}
          </Typography>
          {uniqueRoofTypeByData.map((serviceType, index) => {
            return (
              <GTMChip
                key={index}
                type="selectable"
                onClick={() => onChipClick(serviceType)}
                // eslint-disable-next-line security/detect-object-injection
                isSelected={activeFilters[serviceType.name]}
                gtm={{
                  id: "selector-cards1",
                  label: serviceType.name,
                  action: "Selector - Cards Filter"
                }}
              >
                {serviceType.name}
              </GTMChip>
            );
          })}
        </div>
      </div>
    </Grid>
  );
};

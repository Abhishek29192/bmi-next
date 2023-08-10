import { Chip, ChipProps, Grid, replaceSpaces } from "@bmi-digital/components";
import React from "react";
import withGTM from "../../../../utils/google-tag-manager";
import { ServiceTypeFilter, ServiceTypesPrefixesEnum } from "../../../Service";
import { Data as ServiceType } from "../../../ServiceType";
import { useSiteContext } from "../../../Site";
import { Chips, Filters, Label } from "./style";

interface ServiceLocatorChipsProps {
  microCopyPrefix: ServiceTypesPrefixesEnum;
  onChipClick: (serviceType: ServiceType) => void;
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
    <Grid xs={12} md={6} lg={8}>
      <Filters>
        <Chips>
          <Label variant="h6">
            {getMicroCopy(`${microCopyPrefix}.filtersLabel`)}
          </Label>
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
                data-testid={`service-locator-chip-${replaceSpaces(
                  serviceType.name
                )}`}
              >
                {serviceType.name}
              </GTMChip>
            );
          })}
        </Chips>
      </Filters>
    </Grid>
  );
};

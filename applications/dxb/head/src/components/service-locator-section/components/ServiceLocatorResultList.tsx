import { DetailProps, RoofProLevel } from "@bmi/company-details/src";
import Logo, {
  RoofProElite,
  RoofProExpert,
  RoofProPartnerSmall
} from "@bmi/logo";
import CompanyDetails from "@bmi/company-details";
import Typography from "@bmi/typography";
import React from "react";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import { Service } from "../index";
import { EVENT_CAT_ID_LINK_CLICKS } from "../constants";
import styles from "../styles/ServiceLocatorSection.module.scss";
import { useSiteContext } from "../../Site";
import { getResultDataGtm } from "../helpers";
import { GTMIntegratedLinkCard } from "./IntegratedLinkCard";

interface ResultListProps {
  onListItemClick: (service: Service | null) => void;
  roofersList: Partial<Service[]>;
  onCloseCard: () => void;
  getCompanyDetails: (
    eventCategoryId: string,
    service: Service,
    isAddressHidden?: boolean
  ) => DetailProps[];
  selectedRoofer: Service;
  shouldListCertification: boolean;
}

const iconSourceMap: Record<RoofProLevel, SVGImport> = {
  expert: RoofProExpert,
  partner: RoofProPartnerSmall,
  elite: RoofProElite
};

export const ServiceLocatorResultList = ({
  onListItemClick,
  roofersList,
  onCloseCard,
  getCompanyDetails,
  selectedRoofer,
  shouldListCertification
}: ResultListProps) => {
  const { getMicroCopy } = useSiteContext();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("lg"));

  return (
    <div className={styles["list"]}>
      {roofersList.length ? (
        roofersList.map((service) => (
          <GTMIntegratedLinkCard
            key={service.id}
            onClick={() => onListItemClick(service)}
            onCloseClick={onCloseCard}
            isOpen={selectedRoofer && selectedRoofer.id === service.id}
            title={service.name}
            gtm={getResultDataGtm(service, matches)}
            data-testId={"GTMIntegratedLinkCard-test-id"}
            subtitle={
              <>
                {service.address}
                {service.certification && shouldListCertification && (
                  <div className={styles["roofpro-certification"]}>
                    {getMicroCopy("findARoofer.certificationLabel")}:
                    <Logo
                      source={
                        iconSourceMap[service.certification.toLowerCase()]
                      }
                      className={styles["roofpro-icon"]}
                    />
                  </div>
                )}
              </>
            }
          >
            <CompanyDetails
              details={getCompanyDetails(
                EVENT_CAT_ID_LINK_CLICKS,
                service,
                true
              )}
            >
              <Typography>{service.summary}</Typography>
            </CompanyDetails>
          </GTMIntegratedLinkCard>
        ))
      ) : (
        <div className={styles["no-results"]}>
          <Typography variant="h4" className={styles["no-results-heading"]}>
            {getMicroCopy("findARoofer.noResults.title")}
          </Typography>
          <Typography>
            {getMicroCopy("findARoofer.noResults.subtitle")}
          </Typography>
        </div>
      )}
    </div>
  );
};

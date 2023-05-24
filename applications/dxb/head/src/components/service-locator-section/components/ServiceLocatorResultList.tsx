import {
  AnchorLink,
  CompanyDetailProps,
  CompanyDetails,
  Logo,
  Pagination,
  RoofProElite,
  RoofProExpert,
  RoofProLevel,
  RoofProPartnerSmall,
  Typography
} from "@bmi-digital/components";
import { SVGImport } from "@bmi-digital/svg-import";
import React, { MouseEvent } from "react";
import { microCopy } from "../../../constants/microCopies";
import Image from "../../Image";
import { useSiteContext } from "../../Site";
import { GOOGLE_MAPS_URL } from "../constants";
import { getResultDataGtm } from "../helpers";
import { Service } from "../index";
import styles from "../styles/ServiceLocatorSection.module.scss";
import { GTMIntegratedLinkCard } from "./IntegratedLinkCard";

interface ResultListProps {
  onListItemClick: (service: Service | null) => void;
  roofersList: Partial<Service[]>;
  onCloseCard: () => void;
  onPageChange: (event: React.ChangeEvent<unknown>, page: number) => void;
  page: number;
  pageCount: number;
  getCompanyDetails: (
    service: Service,
    isAddressHidden?: boolean
  ) => CompanyDetailProps[];
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
  onPageChange,
  page,
  pageCount,
  shouldListCertification
}: ResultListProps) => {
  const { getMicroCopy } = useSiteContext();

  const handleAddressClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.stopPropagation();
  };

  return roofersList.length ? (
    <div
      className={`${pageCount > 1 ? `${styles["results-list-section"]}` : ""}`}
      data-testid={"results-list-section"}
    >
      <div className={styles["list"]}>
        {roofersList
          .filter((service): service is Service => service !== undefined)
          .map((service) => (
            <GTMIntegratedLinkCard
              key={service.id}
              onClick={() => onListItemClick(service)}
              onCloseClick={onCloseCard}
              isOpen={selectedRoofer?.id === service?.id}
              title={service.name}
              logo={
                service.companyLogo && (
                  <Image
                    className={styles["company-logo"]}
                    {...service.companyLogo}
                  />
                )
              }
              gtm={getResultDataGtm(service)}
              data-testid={"GTMIntegratedLinkCard-test-id"}
              subtitle={
                <div className={styles["subtitle"]}>
                  <AnchorLink
                    onClick={handleAddressClick}
                    href={`${GOOGLE_MAPS_URL}${encodeURI(service.address)}`}
                    target="_blank"
                  >
                    {service.address}
                  </AnchorLink>

                  {service.certification && shouldListCertification && (
                    <div className={styles["roofpro-certification"]}>
                      {getMicroCopy(
                        microCopy.FIND_A_ROOFER_CERTIFICATION_LABEL
                      )}
                      :
                      <Logo
                        source={
                          iconSourceMap[service.certification.toLowerCase()]
                        }
                        className={styles["roofpro-icon"]}
                      />
                    </div>
                  )}
                </div>
              }
            >
              <CompanyDetails details={getCompanyDetails(service, true)}>
                {service.summary ? (
                  <Typography>{service.summary}</Typography>
                ) : null}
              </CompanyDetails>
            </GTMIntegratedLinkCard>
          ))}
      </div>
      {pageCount > 1 && (
        <Pagination
          className={styles["pagination"]}
          page={page}
          count={pageCount}
          onChange={onPageChange}
        />
      )}
    </div>
  ) : (
    <div className={styles["no-results"]}>
      <Typography variant="h4" className={styles["no-results-heading"]}>
        {getMicroCopy(microCopy.FIND_A_ROOFER_NO_RESULTS_TITLE)}
      </Typography>
      <Typography>
        {getMicroCopy(microCopy.FIND_A_ROOFER_NO_RESULTS_SUBTITLE)}
      </Typography>
    </div>
  );
};

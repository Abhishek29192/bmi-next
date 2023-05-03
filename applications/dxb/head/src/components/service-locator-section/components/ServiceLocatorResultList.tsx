import {
  CompanyDetailProps,
  CompanyDetails,
  Pagination,
  Typography
} from "@bmi-digital/components";
import classnames from "classnames";
import React from "react";
import { microCopy } from "../../../constants/microCopies";
import Image from "../../Image";
import { useSiteContext } from "../../Site";
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
}

export const ServiceLocatorResultList = ({
  onListItemClick,
  roofersList,
  onCloseCard,
  getCompanyDetails,
  selectedRoofer,
  onPageChange,
  page,
  pageCount
}: ResultListProps) => {
  const { getMicroCopy } = useSiteContext();

  return roofersList.length ? (
    <div
      className={classnames(
        pageCount > 1 && styles["results-list-section--with-pagination"]
      )}
      data-testid={"results-list-section"}
    >
      <div className={styles["list"]}>
        {roofersList.map((service) => (
          <GTMIntegratedLinkCard
            key={service.id}
            onClick={() => onListItemClick(service)}
            onCloseClick={onCloseCard}
            isOpen={selectedRoofer && selectedRoofer.id === service.id}
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
          >
            <CompanyDetails details={getCompanyDetails(service)}>
              <Typography>{service.summary}</Typography>
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

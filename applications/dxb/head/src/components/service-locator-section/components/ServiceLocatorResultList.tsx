import {
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
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import classnames from "classnames";
import React from "react";
import { microCopy } from "../../../constants/microCopies";
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
  shouldListCertification,
  onPageChange,
  page,
  pageCount
}: ResultListProps) => {
  const { getMicroCopy } = useSiteContext();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("lg"));

  return roofersList.length ? (
    <div
      className={classnames({
        [styles["results-list-section"]]: pageCount > 1
      })}
    >
      <div className={styles["list"]}>
        {roofersList.map((service) => (
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
                    {getMicroCopy(microCopy.FIND_A_ROOFER_CERTIFICATION_LABEL)}:
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
            <CompanyDetails details={getCompanyDetails(service, true)}>
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

import {
  CompanyDetailProps,
  CompanyDetails,
  RoofProElite,
  RoofProExpert,
  RoofProLevel,
  RoofProPartnerSmall,
  Typography
} from "@bmi-digital/components";
import { SVGImport } from "@bmi-digital/svg-import";
import React from "react";
import { microCopy } from "@bmi/microcopies";
import { useSiteContext } from "../../../Site";
import { getResultDataGtm } from "../../helpers";
import { Service } from "../../index";
import { CompanyLogo } from "../../styles/styles";
import { GTMIntegratedLinkCard } from "../IntegratedLinkCard";
import {
  List,
  NoResults,
  NoResultsHeading,
  RoofProCertification,
  RoofProLogo,
  StyledListWrapper,
  StyledPagination,
  Subtitle
} from "./style";

export interface Props {
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
}: Props) => {
  const { getMicroCopy } = useSiteContext();

  return roofersList.length ? (
    <StyledListWrapper
      pageCount={pageCount}
      data-testid={"results-list-section"}
    >
      <List>
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
                service.companyLogo && <CompanyLogo {...service.companyLogo} />
              }
              gtm={getResultDataGtm(service)}
              data-testid={"GTMIntegratedLinkCard-test-id"}
              subtitle={
                <Subtitle>
                  {service.address}
                  {service.certification && shouldListCertification && (
                    <RoofProCertification>
                      {getMicroCopy(
                        microCopy.FIND_A_ROOFER_CERTIFICATION_LABEL
                      )}
                      :
                      <RoofProLogo
                        source={
                          iconSourceMap[service.certification.toLowerCase()]
                        }
                      />
                    </RoofProCertification>
                  )}
                </Subtitle>
              }
            >
              <CompanyDetails details={getCompanyDetails(service, true)}>
                {service.summary ? (
                  <Typography>{service.summary}</Typography>
                ) : null}
              </CompanyDetails>
            </GTMIntegratedLinkCard>
          ))}
      </List>
      {pageCount > 1 && (
        <StyledPagination
          page={page}
          count={pageCount}
          onChange={onPageChange}
        />
      )}
    </StyledListWrapper>
  ) : (
    <NoResults>
      <NoResultsHeading variant="h4">
        {getMicroCopy(microCopy.FIND_A_ROOFER_NO_RESULTS_TITLE)}
      </NoResultsHeading>
      <Typography>
        {getMicroCopy(microCopy.FIND_A_ROOFER_NO_RESULTS_SUBTITLE)}
      </Typography>
    </NoResults>
  );
};

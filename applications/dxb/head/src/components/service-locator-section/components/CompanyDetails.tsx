import { CompanyDetailProps } from "@bmi-digital/components/company-details";
import { GTM } from "@bmi-digital/components";
import { microCopy } from "@bmi/microcopies";
import { Service } from "..";
import { GetMicroCopy } from "../../MicroCopy";
import { EntryTypeEnum } from "../../Service";
import { EVENT_CAT_ID_LINK_CLICKS, GOOGLE_MAPS_URL } from "../constants";
import { getSocialMediaGtm } from "../utils/getSocialMediaGtm";
import type { LatLngLiteral as GoogleLatLngLiteral } from "@bmi-digital/components/google-api";

const { ROOFER_TYPE, MERCHANT_TYPE, BRANCH_TYPE } = EntryTypeEnum;

type GetServiceDataGTMProps = {
  service: Service;
  sectionType: EntryTypeEnum;
  link: string;
  localisedLabel: string;
};

const getServiceDataGTM = ({
  service,
  sectionType,
  link,
  localisedLabel
}: GetServiceDataGTMProps): GTM => {
  const label = `${service.name} - ${service.address}${
    service.certification ? ` - ${service.certification}` : ""
  } - ${service.serviceTypes?.[0].name || service.entryType}`;
  if (sectionType !== ROOFER_TYPE) {
    return {
      id: EVENT_CAT_ID_LINK_CLICKS,
      label: `${label} - ${localisedLabel}`,
      action: link
    };
  }
  return { id: EVENT_CAT_ID_LINK_CLICKS, label, action: link };
};

type GetAddressProps = {
  service: Service;
  getMicroCopy: GetMicroCopy;
  sectionType: EntryTypeEnum;
  centre?: GoogleLatLngLiteral;
};

const getAddress = ({
  service,
  getMicroCopy,
  sectionType,
  centre
}: GetAddressProps): CompanyDetailProps["address"] => {
  const localisedLabel = getMicroCopy(microCopy.GLOBAL_ADDRESS);
  const link = `${GOOGLE_MAPS_URL}${
    centre ? `${centre.lat},+${centre.lng}/` : ""
  }${encodeURI(service.address)}/`;
  return {
    address: service.address,
    link: link,
    gtm: getServiceDataGTM({ service, sectionType, link, localisedLabel })
  };
};

const getPhone = (
  service: Service,
  getMicroCopy: GetMicroCopy,
  sectionType: EntryTypeEnum
): CompanyDetailProps["phone"] => {
  if (!service.phone) {
    return undefined;
  }

  const localisedLabel = getMicroCopy(microCopy.GLOBAL_TELEPHONE);
  const link = `tel:${service.phone}`;
  return {
    phone: service.phone,
    label: localisedLabel,
    gtm: getServiceDataGTM({ service, sectionType, link, localisedLabel })
  };
};

const getEmail = (
  service: Service,
  getMicroCopy: GetMicroCopy,
  sectionType: EntryTypeEnum
): CompanyDetailProps["email"] => {
  if (!service.email) {
    return undefined;
  }

  const localisedLabel = getMicroCopy(microCopy.GLOBAL_EMAIL);
  const link = `mailto:${service.email}`;
  return {
    email: service.email,
    label: localisedLabel,
    gtm: getServiceDataGTM({ service, sectionType, link, localisedLabel })
  };
};

const getWebsiteLabelMicrocopy = (
  entryType: EntryTypeEnum,
  getMicroCopy: GetMicroCopy
) => {
  switch (entryType) {
    case ROOFER_TYPE:
      return getMicroCopy(microCopy.FIND_A_ROOFER_WEBSITE_LABEL);
    case MERCHANT_TYPE:
      return getMicroCopy(microCopy.FIND_A_MERCHANT_WESBITE_LABEL);
    case BRANCH_TYPE:
      return getMicroCopy(microCopy.FIND_A_BRANCH_WESBITE_LABEL);
  }
};

const getWebsite = (
  service: Service,
  getMicroCopy: GetMicroCopy,
  sectionType: EntryTypeEnum
): CompanyDetailProps["website"] => {
  if (!service.website) {
    return undefined;
  }

  const link = service.website.startsWith("http")
    ? service.website
    : `https://${service.website}`;

  const localisedLabel = getWebsiteLabelMicrocopy(
    service.entryType,
    getMicroCopy
  );
  return {
    text: service.websiteLinkAsLabel ? localisedLabel : new URL(link).hostname,
    website: link,
    gtm: getServiceDataGTM({
      service,
      sectionType,
      link,
      localisedLabel
    }),
    label: localisedLabel
  };
};

const getSocialMedia = (
  service: Service,
  getMicroCopy: GetMicroCopy
): CompanyDetailProps["socialMedia"] => {
  const socialMedia = [
    service.facebook,
    service.linkedIn,
    service.twitter,
    service.instagram
  ];

  if (socialMedia.every((channel) => !channel)) {
    return undefined;
  }

  return {
    label: getMicroCopy(microCopy.FIND_A_ROOFER_SOCIAL_MEDIA_LABEL),
    ...(service.facebook && {
      facebook: {
        handle: service.facebook,
        gtm: getSocialMediaGtm({ channel: "facebook", service })
      }
    }),
    ...(service.linkedIn && {
      linkedIn: {
        handle: service.linkedIn,
        gtm: getSocialMediaGtm({ channel: "linkedIn", service })
      }
    }),
    ...(service.twitter && {
      twitter: {
        handle: service.twitter,
        gtm: getSocialMediaGtm({ channel: "twitter", service })
      }
    }),
    ...(service.instagram && {
      instagram: {
        handle: service.instagram,
        gtm: getSocialMediaGtm({ channel: "instagram", service })
      }
    })
  };
};

const getFax = (fax: Service["fax"], getMicroCopy: GetMicroCopy) =>
  fax
    ? {
        fax: fax,
        label: getMicroCopy(microCopy.GLOBAL_FAX)
      }
    : undefined;

const getType = (service: Service, getMicroCopy: GetMicroCopy) =>
  service.serviceTypes && service.serviceTypes.length
    ? {
        label: getMicroCopy(microCopy.FIND_A_ROOFER_ROOF_TYPE_LABEL),
        text: service.serviceTypes
          .map((serviceType) => serviceType.name)
          .join(", ")
      }
    : undefined;

type CreateCompanyDetailsProps = {
  sectionType: EntryTypeEnum;
  service: Service;
  getMicroCopy: GetMicroCopy;
  centre?: GoogleLatLngLiteral;
};

export const createCompanyDetails = ({
  sectionType,
  service,
  getMicroCopy,
  centre
}: CreateCompanyDetailsProps): CompanyDetailProps => {
  return {
    summary: service.summary,
    address: getAddress({
      service,
      getMicroCopy,
      sectionType,
      centre
    }),
    distance:
      typeof service.distance === "number"
        ? {
            text: `${Math.floor(service.distance) / 1000}km`,
            label: getMicroCopy(microCopy.FIND_A_ROOFER_DISTANCE_LABEL)
          }
        : undefined,
    phone: getPhone(service, getMicroCopy, sectionType),
    email: getEmail(service, getMicroCopy, sectionType),
    website: getWebsite(service, getMicroCopy, sectionType),
    roofProLevel:
      sectionType === ROOFER_TYPE && service.certification
        ? {
            label: getMicroCopy(microCopy.FIND_A_ROOFER_CERTIFICATION_LABEL),
            level: service.certification
          }
        : undefined,
    fax:
      sectionType === BRANCH_TYPE
        ? getFax(service.fax, getMicroCopy)
        : undefined,
    content:
      sectionType === ROOFER_TYPE ? getType(service, getMicroCopy) : undefined,
    socialMedia: getSocialMedia(service, getMicroCopy)
  };
};

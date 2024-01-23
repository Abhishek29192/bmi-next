import { CompanyDetailProps } from "@bmi-digital/components/company-details";
import { Service } from "..";
import { GetMicroCopy } from "../../MicroCopy";
import { EntryTypeEnum } from "../../Service";
import { EVENT_CAT_ID_LINK_CLICKS, GOOGLE_MAPS_URL } from "../constants";
import { getSocialMediaGtm } from "../utils/getSocialMediaGtm";
import type { LatLngLiteral as GoogleLatLngLiteral } from "@bmi-digital/components/google-api";

const { ROOFER_TYPE, MERCHANT_TYPE, BRANCH_TYPE } = EntryTypeEnum;

const getServiceDataGTM = (
  service: Service,
  sectionType: EntryTypeEnum,
  action: string,
  linkOrButtonText?: string
) => {
  const label = `${service.name} - ${service.address}${
    service.certification ? ` - ${service.certification}` : ""
  } - ${service.serviceTypes?.[0]?.name || service.entryType}`;
  if (sectionType !== ROOFER_TYPE) {
    return {
      id: EVENT_CAT_ID_LINK_CLICKS,
      label: `${label}${linkOrButtonText ? ` - ${linkOrButtonText}` : ""}`,
      action
    };
  }
  return { id: EVENT_CAT_ID_LINK_CLICKS, label, action };
};

const getAddress = (
  service: Service,
  getMicroCopy: GetMicroCopy,
  sectionType: EntryTypeEnum,
  googleUrlLatLng?: GoogleLatLngLiteral
): CompanyDetailProps["address"] => {
  const localisedLabel = getMicroCopy("global.address");
  const link = `${GOOGLE_MAPS_URL}${
    googleUrlLatLng ? `${googleUrlLatLng.lat},+${googleUrlLatLng.lng}` : ""
  }/${encodeURI(service.address)}/`;
  return {
    address: service.address,
    link: link,
    gtm: getServiceDataGTM(service, sectionType, link, localisedLabel)
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

  const localisedLabel = getMicroCopy("global.telephone");
  return {
    phone: service.phone,
    label: localisedLabel,
    gtm: getServiceDataGTM(
      service,
      sectionType,
      `tel:${service.phone}`,
      localisedLabel
    )
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

  const localisedLabel = getMicroCopy("global.email");
  return {
    email: service.email,
    label: localisedLabel,
    gtm: getServiceDataGTM(
      service,
      sectionType,
      `mailto:${service.email}`,
      localisedLabel
    )
  };
};

const getWebsiteLabelMicrocopy = (
  entryType: EntryTypeEnum,
  getMicroCopy: GetMicroCopy
) => {
  switch (entryType) {
    case ROOFER_TYPE:
      return getMicroCopy("findARoofer.websiteLabel");
    case MERCHANT_TYPE:
      return getMicroCopy("findAMerchant.websiteLabel");
    case BRANCH_TYPE:
      return getMicroCopy("findABranch.websiteLabel");
    default:
      return undefined;
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

  const websiteWithProtocol = service.website.startsWith("http")
    ? service.website
    : `https://${service.website}`;

  const websiteLabelMicrocopy = getWebsiteLabelMicrocopy(
    service.entryType,
    getMicroCopy
  );
  return {
    text: service.websiteLinkAsLabel
      ? websiteLabelMicrocopy
      : new URL(websiteWithProtocol).hostname,
    website: websiteWithProtocol,
    gtm: getServiceDataGTM(
      service,
      sectionType,
      websiteWithProtocol,
      websiteLabelMicrocopy
    ),
    label: websiteLabelMicrocopy
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
    label: getMicroCopy("findARoofer.socialMediaLabel"),
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

export const createCompanyDetails = (
  sectionType: EntryTypeEnum,
  service: Service,
  getMicroCopy: GetMicroCopy,
  googleUrlLatLng: GoogleLatLngLiteral
): CompanyDetailProps => {
  const fax = service.fax && {
    fax: service.fax,
    label: getMicroCopy("global.fax")
  };

  const type = service.serviceTypes &&
    service.serviceTypes.length && {
      label: getMicroCopy("findARoofer.roofTypeLabel"),
      text: service.serviceTypes
        .map((serviceType) => serviceType.name)
        .join(", ")
    };

  return {
    summary: service.summary,
    address: getAddress(service, getMicroCopy, sectionType, googleUrlLatLng),
    distance: service.distance && {
      text: `${Math.floor(service.distance) / 1000}km`,
      label: getMicroCopy("findARoofer.distanceLabel")
    },
    phone: getPhone(service, getMicroCopy, sectionType),
    email: getEmail(service, getMicroCopy, sectionType),
    website: getWebsite(service, getMicroCopy, sectionType),
    roofProLevel:
      sectionType === ROOFER_TYPE && service.certification
        ? {
            label: getMicroCopy("findARoofer.certificationLabel"),
            level: service.certification
          }
        : undefined,
    fax: sectionType === BRANCH_TYPE ? fax : undefined,
    content: sectionType === ROOFER_TYPE ? type : undefined,
    ...getSocialMedia(service, getMicroCopy)
  };
};

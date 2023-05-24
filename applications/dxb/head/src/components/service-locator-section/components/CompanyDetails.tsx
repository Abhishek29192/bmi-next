import { CompanyDetailProps, RoofProLevel } from "@bmi-digital/components";
import React from "react";
import { Service } from "..";
import { devLog } from "../../../utils/devLog";
import { getClickableActionFromUrl } from "../../Link";
import { EntryTypeEnum } from "../../Service";
import { EVENT_CAT_ID_LINK_CLICKS, GOOGLE_MAPS_URL } from "../constants";
import { SocialMediaLinks } from "./SocialMediaLinks/SocialMediaLinks";

const { ROOFER_TYPE, MERCHANT_TYPE, BRANCH_TYPE } = EntryTypeEnum;

interface Props {
  (
    sectionType: EntryTypeEnum | undefined,
    service: Service,
    countryCode: string,
    localizationCb: (s: string) => string,
    isAddressHidden: boolean,
    googleURLLatLng: string
  ): CompanyDetailProps[];
}

export const createCompanyDetails: Props = (
  sectionType,
  service,
  countryCode,
  localizationCb,
  isAddressHidden,
  googleURLLatLng
) => {
  if (!service) {
    return;
  }

  if (![BRANCH_TYPE, MERCHANT_TYPE, ROOFER_TYPE].includes(sectionType)) {
    devLog("Invalid section type passed to service locator:", sectionType);
    return [];
  }
  const localization = {
    globalAddress: localizationCb("global.address"),
    distanceLabel: localizationCb("findARoofer.distanceLabel"),
    directionsLabel: localizationCb("findARoofer.getDirectionsLabel"),
    globalTelephone: localizationCb("global.telephone"),
    globalEmail: localizationCb("global.email"),
    globalWebsite: localizationCb("global.website"),
    faxLabel: localizationCb("global.fax"),
    rooferWebsiteLabel: localizationCb("findARoofer.websiteLabel"),
    merchantWebsiteLabel: localizationCb("findAMerchant.websiteLabel"),
    branchWebsiteLabel: localizationCb("findABranch.websiteLabel"),
    roofTypeLabel: localizationCb("findARoofer.roofTypeLabel"),
    certificationLabel: localizationCb("findARoofer.certificationLabel"),
    socialMediaLabel: localizationCb("findARoofer.socialMediaLabel")
  };

  const getServiceDataGTM = (action: string, linkOrButtonText?: string) => {
    const serviceType =
      (service.serviceTypes?.length &&
        service.serviceTypes?.length > 0 &&
        service.serviceTypes[0].name) ||
      service.entryType;
    const label = `${service.name} - ${service.address}${
      service.certification ? ` - ${service.certification}` : ""
    } - ${serviceType}`;
    if (sectionType !== ROOFER_TYPE) {
      return {
        id: EVENT_CAT_ID_LINK_CLICKS,
        label: `${label}${linkOrButtonText ? ` - ${linkOrButtonText}` : ""}`,
        action
      };
    } else {
      return { id: EVENT_CAT_ID_LINK_CLICKS, label, action };
    }
  };

  const getSocialMedia = (): CompanyDetailProps => {
    const socialMedia = [
      service.facebook,
      service.linkedIn,
      service.twitter,
      service.instagram
    ];

    if (socialMedia.every((channel) => !channel)) {
      return;
    }

    return {
      type: "content",
      label: localization.socialMediaLabel,
      text: <SocialMediaLinks service={service} />
    };
  };

  const getWebsiteLabelMicrocopy = (entryType: EntryTypeEnum) => {
    switch (entryType) {
      case ROOFER_TYPE:
        return localization.rooferWebsiteLabel;
      case MERCHANT_TYPE:
        return localization.merchantWebsiteLabel;
      case BRANCH_TYPE:
        return localization.branchWebsiteLabel;
      default:
        return null;
    }
  };

  const websiteWithProtocol: string =
    !service.website || service.website.startsWith("http")
      ? service.website
      : `https://${service.website}`;

  const websiteLabelMicrocopy = getWebsiteLabelMicrocopy(service.entryType);

  const actions = {
    address: getClickableActionFromUrl(
      undefined,
      `${GOOGLE_MAPS_URL}${googleURLLatLng}/${encodeURI(service.address)}/`,
      countryCode,
      undefined,
      localization.globalAddress,
      undefined,
      undefined,
      getServiceDataGTM(
        `${GOOGLE_MAPS_URL}${googleURLLatLng}/${encodeURI(service.address)}/`,
        localization.globalAddress
      )
    ),
    phone: getClickableActionFromUrl(
      undefined,
      `tel:${service.phone}`,
      countryCode,
      undefined,
      localization.globalTelephone,
      undefined,
      undefined,
      getServiceDataGTM(`tel:${service.phone}`, localization.globalTelephone)
    ),
    website: getClickableActionFromUrl(
      undefined,
      websiteWithProtocol,
      countryCode,
      undefined,
      websiteLabelMicrocopy,
      undefined,
      undefined,
      getServiceDataGTM(websiteWithProtocol, websiteLabelMicrocopy)
    ),
    email: getClickableActionFromUrl(
      undefined,
      `mailto:${service.email}`,
      countryCode,
      undefined,
      localization.globalEmail,
      undefined,
      undefined,
      getServiceDataGTM(`mailto:${service.email}`, localization.globalEmail)
    )
  };

  const address = {
    type: "address",
    display: "contentOnly",
    text: service.address,
    label: localization.globalAddress,
    action: actions.address
  };

  const distance = service.distance
    ? {
        type: "distance",
        display: "label",
        text: `${Math.floor(service.distance) / 1000}km`,
        label: localization.distanceLabel
      }
    : undefined;

  const phone = service.phone
    ? {
        type: "phone",
        display: "label",
        text: service.phone,
        action: actions.phone,
        label: localization.globalTelephone
      }
    : undefined;

  const email = service.email
    ? {
        type: "email",
        display: "label",
        text: service.email,
        action: actions.email,
        label: localization.globalEmail
      }
    : undefined;

  const website = websiteWithProtocol
    ? {
        type: "website",
        display: "label",
        text: service.websiteLinkAsLabel
          ? websiteLabelMicrocopy
          : new URL(websiteWithProtocol).hostname,
        action: actions.website,
        label: localization.globalWebsite
      }
    : undefined;

  const fax = service.fax
    ? {
        type: "content",
        text: service.fax,
        label: localization.faxLabel
      }
    : undefined;

  const type =
    service.serviceTypes && service.serviceTypes.length
      ? {
          type: "roofType",
          label: localization.roofTypeLabel,
          text: (
            <b>
              {service.serviceTypes
                .map((serviceType) => serviceType.name)
                .join(", ")}
            </b>
          )
        }
      : undefined;

  const certification = service.certification
    ? {
        type: "roofProLevel",
        label: localization.certificationLabel,
        level: service.certification.toLowerCase() as RoofProLevel
      }
    : undefined;

  const details = [];

  if (!isAddressHidden) {
    details.push(address);
  }

  if (sectionType === ROOFER_TYPE) {
    details.push(certification);
  }

  details.push(distance, phone);

  if (sectionType === BRANCH_TYPE) {
    details.push(fax);
  }

  details.push(email, website, getSocialMedia());

  if (sectionType === ROOFER_TYPE) {
    details.push(type);
  }

  return details.filter((detail) => !!detail);
};

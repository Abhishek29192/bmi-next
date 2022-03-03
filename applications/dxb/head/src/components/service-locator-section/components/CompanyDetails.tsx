import React from "react";
import { CompanyDetailProps, RoofProLevel } from "@bmi/components";
import { devLog } from "../../../utils/devLog";
import { EntryTypeEnum } from "../../Service";
import { getClickableActionFromUrl } from "../../Link";
import { EVENT_CAT_ID_LINK_CLICKS } from "../constants";
import { Service } from "..";

export const createCompanyDetails = (
  sectionType: EntryTypeEnum | undefined,
  service: Service,
  matches: boolean,
  countryCode: string,
  localizationCb: (s: string) => string,
  isAddressHidden: boolean,
  googleURLLatLng: string
): CompanyDetailProps[] => {
  const shouldShowIcons = sectionType === EntryTypeEnum.ROOFER_TYPE;
  const isAddressClickable = sectionType === EntryTypeEnum.BRANCH_TYPE;
  const shouldShowWebsiteLinkAsLabel =
    sectionType === EntryTypeEnum.MERCHANT_TYPE;

  const localization = {
    globalAddress: localizationCb("global.address"),
    distanceLabel: localizationCb("findARoofer.distanceLabel"),
    directionsLabel: localizationCb("findARoofer.getDirectionsLabel"),
    globalTelephone: localizationCb("global.telephone"),
    globalEmail: localizationCb("global.email"),
    websiteLabel: localizationCb("findARoofer.websiteLabel"),
    globalWebsite: localizationCb("global.website"),
    faxLabel: localizationCb("global.fax"),
    roofTypeLabel: localizationCb("findARoofer.roofTypeLabel"),
    certificationLabel: localizationCb("findARoofer.certificationLabel")
  };

  const getServiceDataGTM = (action: string, linkOrButtonText?: string) => {
    const serviceType =
      (service?.serviceTypes?.length &&
        service?.serviceTypes?.length > 0 &&
        service?.serviceTypes[0].name) ||
      service?.entryType;
    const label = `${service?.name} - ${service?.address}${
      service?.certification ? ` - ${service?.certification}` : ""
    } - ${serviceType}`;
    if (matches || sectionType !== EntryTypeEnum.ROOFER_TYPE) {
      return {
        id: EVENT_CAT_ID_LINK_CLICKS,
        label: `${label}${linkOrButtonText ? ` - ${linkOrButtonText}` : ""}`,
        action
      };
    } else {
      return { id: EVENT_CAT_ID_LINK_CLICKS, label, action };
    }
  };

  const actions = {
    address: getClickableActionFromUrl(
      undefined,
      `https://www.google.com/maps/dir/${googleURLLatLng}/${encodeURI(
        service.address
      )}/`,
      countryCode,
      undefined,
      localization.globalAddress,
      undefined,
      undefined,
      getServiceDataGTM(
        `https://www.google.com/maps/dir/${googleURLLatLng}/${encodeURI(
          service.address
        )}/`,
        localization.globalAddress
      )
    ),
    directions: getClickableActionFromUrl(
      undefined,
      `https://www.google.com/maps/dir/${googleURLLatLng}/${encodeURI(
        service.address
      )}/`,
      countryCode,
      undefined,
      localization.directionsLabel,
      undefined,
      undefined,
      getServiceDataGTM(
        `https://www.google.com/maps/dir/${googleURLLatLng}/${encodeURI(
          service.address
        )}/`,
        localization.directionsLabel
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
      service.website,
      countryCode,
      undefined,
      shouldShowWebsiteLinkAsLabel
        ? localization.globalWebsite
        : localization.websiteLabel,
      undefined,
      undefined,
      getServiceDataGTM(
        service.website,
        shouldShowWebsiteLinkAsLabel
          ? localization.globalWebsite
          : localization.websiteLabel
      )
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
  const address: CompanyDetailProps = {
    type: "address",
    display: shouldShowIcons ? "icon" : "contentOnly",
    text: service.address,
    label: localization.globalAddress,
    action: isAddressClickable ? actions.address : undefined
  };
  const detailsStart = isAddressHidden ? [] : [address];

  const distance: CompanyDetailProps | undefined =
    service.distance !== undefined
      ? {
          type: "distance",
          display: shouldShowIcons ? "icon" : "label",
          text: `${Math.floor(service.distance) / 1000}km`,
          label: localization.distanceLabel
        }
      : undefined;
  const directions: CompanyDetailProps | undefined = {
    type: "cta",
    text: localization.directionsLabel,
    action: actions.directions,
    label: localization.directionsLabel
  };
  const phone: CompanyDetailProps | undefined = service.phone
    ? {
        type: "phone",
        display: shouldShowIcons ? "icon" : "label",
        text: service.phone,
        action: actions.phone,
        label: localization.globalTelephone
      }
    : undefined;
  const email: CompanyDetailProps | undefined = service.email
    ? {
        type: "email",
        display: shouldShowIcons ? "icon" : "label",
        text: service.email,
        action: actions.email,
        label: localization.globalEmail
      }
    : undefined;
  const website: CompanyDetailProps | undefined = service.website
    ? {
        type: "website",
        display: shouldShowIcons ? "icon" : "label",
        text: shouldShowWebsiteLinkAsLabel
          ? service.website
          : localization.websiteLabel,
        action: actions.website,
        label: shouldShowWebsiteLinkAsLabel
          ? localization.globalWebsite
          : localization.websiteLabel
      }
    : undefined;
  const fax: CompanyDetailProps | undefined = service.fax
    ? {
        type: "content",
        text: service.fax,
        textStyle: "bold",
        label: localization.faxLabel
      }
    : undefined;
  const type: CompanyDetailProps | undefined =
    service.serviceTypes &&
    service.serviceTypes.length &&
    service.serviceTypes.length > 0
      ? {
          type: "content",
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

  const certification: CompanyDetailProps = service.certification
    ? {
        type: "roofProLevel",
        label: localization.certificationLabel,
        level: service.certification.toLowerCase() as RoofProLevel
      }
    : undefined;

  switch (sectionType) {
    case EntryTypeEnum.ROOFER_TYPE:
      return [
        ...detailsStart,
        distance,
        directions,
        phone,
        email,
        website,
        type,
        certification
      ].filter(Boolean);
    case EntryTypeEnum.BRANCH_TYPE:
      return [...detailsStart, distance, phone, email, fax, directions].filter(
        Boolean
      );
    case EntryTypeEnum.MERCHANT_TYPE:
      return [
        ...detailsStart,
        distance,
        phone,
        email,
        website,
        directions
      ].filter(Boolean);
    default:
      devLog("Invalid section type passed to service locator:", sectionType);
      return [];
  }
};

import { GTM } from "../../../utils/google-tag-manager";
import { Service } from "../index";

export interface Props {
  service: Service;
  channel: string;
}

export const ID = "cta-share-ext-company";

export const getSocialMediaGtm = ({ channel, service }: Props): GTM => {
  const { address, certification, serviceTypes, name } = service;

  const roofProLevel = certification ? `- ${certification.toLowerCase()} ` : "";
  const serviceType = serviceTypes
    ? serviceTypes.map(({ name }) => name).join(", ")
    : "";

  const label = `${name} - ${address} ${roofProLevel}- ${serviceType} - ${channel}`;

  return {
    action: channel,
    id: ID,
    label
  };
};

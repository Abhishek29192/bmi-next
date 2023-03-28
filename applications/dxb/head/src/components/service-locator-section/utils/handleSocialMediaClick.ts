import { GTM, pushToDataLayer } from "../../../utils/google-tag-manager";
import { Service } from "../index";

export interface Props {
  service: Service;
  channel: string;
}

export const ID = "cta-share-ext-company";

export const handleSocialMediaClick = ({ channel, service }: Props) => {
  const { address, certification, entryType, name } = service;
  const roofProLevel = certification ? `- ${certification.toLowerCase()} ` : "";
  const label = `${name} - ${address} ${roofProLevel}- ${entryType} - ${channel}`;

  const gtm: GTM = {
    action: channel,
    id: ID,
    label
  };

  pushToDataLayer(gtm);

  // return true to allow anchor link to redirect
  return true;
};

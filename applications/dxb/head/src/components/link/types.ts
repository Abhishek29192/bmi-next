import type { ButtonProps } from "@bmi-digital/components/button";
import type { GTM } from "@bmi-digital/components/types";
import type { IconName } from "../Icon";
import type { Data as PromoData } from "../Promo";
import type { SectionData } from "../Sections";
import type { Data as PageInfoData } from "../PageInfo";

type CustomisableButtonProps = Pick<
  ButtonProps,
  "startIcon" | "endIcon" | "variant" | "hasDarkBackground"
>;

export type LinkProps = {
  to: string;
  hasBrandColours?: boolean;
  className?: string;
  gtm?: Partial<GTM>;
  children: string;
};

export type ButtonLinkLinkProps = {
  to: string;
  hasBrandColours?: boolean;
  className?: string;
  gtm?: Partial<GTM>;
  children: string;
} & CustomisableButtonProps;

export type ToolProps = {
  parameters: Data["parameters"];
  onClick: (...args: unknown[]) => void;
  hasBrandColours?: boolean;
  className?: string;
  children: string;
  gtm?: Partial<GTM>;
};

export type ButtonLinkToolProps = {
  parameters: Data["parameters"];
  onClick: (...args: unknown[]) => void;
  hasBrandColours?: boolean;
  className?: string;
  children: string;
  gtm?: Partial<GTM>;
} & CustomisableButtonProps;

export type DialogProps = {
  dialogContent: Data["dialogContent"];
  onClick: (...args: unknown[]) => void;
  hasBrandColours?: boolean;
  className?: string;
  children: string;
  gtm?: Partial<GTM>;
};

export type ButtonLinkDialogProps = {
  dialogContent: Data["dialogContent"];
  onClick: (...args: unknown[]) => void;
  hasBrandColours?: boolean;
  className?: string;
  children: string;
  gtm?: Partial<GTM>;
} & CustomisableButtonProps;

export type HubSpotProps = {
  hubSpotCtaId: string;
  hasBrandColours?: boolean;
  className?: string;
  gtm?: Partial<GTM>;
  children: string;
};

export type ButtonLinkHubSpotProps = {
  hubSpotCtaId: string;
  hasBrandColours?: boolean;
  className?: string;
  gtm?: Partial<GTM>;
  children: string;
} & CustomisableButtonProps;

type BaseProps = {
  data: Data;
  children: string;
  hasBrandColours?: boolean;
  className?: string;
  gtm?: Partial<GTM>;
  onClick?: (...args: unknown[]) => void;
};

export type ButtonLinkProps = BaseProps & CustomisableButtonProps;

export type Props = BaseProps;

export enum DataTypeEnum {
  External = "External",
  Internal = "Internal",
  Asset = "Asset",
  Visualiser = "Visualiser",
  Calculator = "Calculator",
  Dialog = "Dialog",
  HubSpotCta = "HubSpot CTA"
}

export type Data = {
  __typename: "Link";
  id: string;
  label: string;
  icon: IconName | null;
  isLabelHidden: boolean | null;
  url: string | null;
  type: DataTypeEnum;
  parameters: { [key: string]: unknown } | null;
  dialogContent: SectionData | null;
  linkedPage: {
    path: string | null;
  } | null;
  asset?: {
    url: string | null;
  } | null;
  hubSpotCTAID: string | null;
  queryParams: string | null;
};

export type NavigationItem = {
  __typename: "NavigationItem";
  type: "Heading" | "Separator";
  value: string;
};

export type NavigationData = {
  __typename: "Navigation";
  label: string | null;
  link: Data | null;
  promos?: (PromoData | PageInfoData)[] | null;
  links: (NavigationData | NavigationItem | Data)[];
};

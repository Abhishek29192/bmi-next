import type { Data as PageInfoData } from "../../components/PageInfo";
import type { Data as PromoData } from "../../components/Promo";

export type CTACardPromoData = Pick<
  PromoData,
  "title" | "cta" | "featuredMedia" | "featuredVideo"
>;

export type CTACardPageInfoData = Pick<
  PageInfoData,
  "title" | "path" | "featuredMedia" | "featuredVideo"
>;

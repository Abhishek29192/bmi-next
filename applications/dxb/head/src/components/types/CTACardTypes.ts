import type { Data as PageInfoData } from "../../components/PageInfo";
import type { Data as PromoData } from "../../components/Promo";

export type CTACardPromoData = {
  title: NonNullable<PromoData["title"]>;
  cta: NonNullable<PromoData["cta"]>;
} & CTACardMedia;

export type CTACardPageInfoData = Pick<PageInfoData, "title"> &
  CTACardMedia & { path: NonNullable<PageInfoData["path"]> };

type CTACardMedia =
  | {
      featuredMedia: NonNullable<PromoData["featuredMedia"]>;
      featuredVideo?: never;
    }
  | {
      featuredMedia?: never;
      featuredVideo: NonNullable<PromoData["featuredVideo"]>;
    };

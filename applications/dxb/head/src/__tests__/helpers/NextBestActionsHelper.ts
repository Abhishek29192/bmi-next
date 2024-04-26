import {
  NextBestActionsPromoData,
  NextBestActionsPageInfoData
} from "../../components/next-best-actions/NextBestActions";
import createInternalLinkData from "./LinkHelper";

const createPromoNBA = (
  promoData?: Partial<NextBestActionsPromoData>
): NextBestActionsPromoData => ({
  title: "Promo NBA Title",
  subtitle: "Promo NBA Subtitle",
  cta: createInternalLinkData(),
  ...promoData
});

export const createPageInfoNBA = (
  pageInfoData?: Partial<NextBestActionsPageInfoData>
): NextBestActionsPageInfoData => ({
  title: "Page Info NBA Title",
  subtitle: "Page Info NBA Subtitle",
  path: "en/page-info/path",
  ...pageInfoData
});

export default createPromoNBA;

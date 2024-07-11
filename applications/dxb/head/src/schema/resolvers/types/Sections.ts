import type { ContentfulCardCollection } from "./CardCollection";
import type { ContentfulIframeSectionData } from "./IframeSection";
import type { ContentfulCarouselSection } from "./CarouselSection";
import type { Data as EmbeddedScriptSectionData } from "../../../components/EmbeddedScriptSection";
import type { ContentfulLeadBlock } from "./LeadBlock";
import type { ContentfulPromo } from "./Promo";
import type { ContentfulSignUpBlockData } from "./SignUpBlock";
import type { ContentfulTitleWithContentData } from "./TitleWithContent";
import type { ContentfulVideoSectionData } from "./VideoSection";
import type { ContentfulSyndicateSectionData } from "./SyndicateSection";
import type { ContentfulServiceLocatorData } from "./ServiceLocatorSection";

export type ContentfulSection =
  | ContentfulCardCollection
  | ContentfulCarouselSection
  | ContentfulIframeSectionData
  | ContentfulPromo
  | ContentfulServiceLocatorData
  | ContentfulSignUpBlockData
  | ContentfulSyndicateSectionData
  | ContentfulTitleWithContentData
  | ContentfulVideoSectionData
  | EmbeddedScriptSectionData
  | ContentfulLeadBlock;

export type ContentfulSections = ContentfulSection[];

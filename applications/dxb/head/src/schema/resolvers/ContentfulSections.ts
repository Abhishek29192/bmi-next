import { isDefined } from "@bmi/utils";
import resolveCardCollectionSection from "./ContentfulCardCollectionSection";
import resolveCarouselSection from "./ContentfulCarouselSection";
import resolveLeadBlock from "./ContentfulLeadBlock";
import resolveIframe from "./ContentfulIframeSection";
import resolvePromo from "./ContentfulPromo";
import resolveSignUpBlock from "./ContentfulSignUpBlock";
import resolveTitleWithContent from "./ContentfulTitleWithContent";
import resolveVideoSection from "./ContentfulVideoSection";
import resolveSyndicateSection from "./ContentfulSyndicateSection";
import resolveServiceLocatorSection from "./ContentfulServiceLocatorSection";
import type { Data as SectionsData } from "../../components/Sections";
import type { ContentfulSections } from "./types/Sections";

const resolveSections = async (
  sections: ContentfulSections
): Promise<SectionsData> => {
  const promises = sections.map((section) => {
    switch (section.__typename) {
      case "CardCollectionSection":
        return resolveCardCollectionSection(section);
      case "CarouselSection":
        return resolveCarouselSection(section);
      case "EmbeddedScriptSection":
        return section;
      case "Iframe":
        return resolveIframe(section);
      case "LeadBlockSection":
        return resolveLeadBlock(section);
      case "Promo":
        return resolvePromo(section);
      case "ServiceLocatorSection":
        return resolveServiceLocatorSection(section);
      case "SignupBlock":
        return resolveSignUpBlock(section);
      case "TitleWithContent":
        return resolveTitleWithContent(section);
      case "VideoSection":
        return resolveVideoSection(section);
      case "VillainSection":
        return resolveSyndicateSection(section);
      default:
        return null;
    }
  });

  const resolvedPromises = await Promise.all(promises);
  return resolvedPromises.filter(isDefined);
};

export default resolveSections;

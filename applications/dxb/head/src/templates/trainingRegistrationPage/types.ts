import type { Training } from "@bmi/elasticsearch-types";
import type { ESResponse } from "../../types/elasticsearch";
import type { Data as SiteData } from "../../components/Site";

type TrainingRegistrationPageData = {
  __typename: "ContentfulTrainingRegistrationPage";
  path: string;
};

export type TrainingRegistrationPageProps = {
  data: {
    contentfulTrainingRegistrationPage: TrainingRegistrationPageData;
    contentfulSite: SiteData;
  };
  pageContext: {
    variantCodeToPathMap: Record<string, string> | null;
    pageId: string;
    siteId: string;
  };
};

export type ESTrainingDetails = ESResponse<Training>;

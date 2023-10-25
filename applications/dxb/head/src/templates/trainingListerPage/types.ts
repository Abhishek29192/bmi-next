import { Training } from "@bmi/elasticsearch-types";
import { Data as PageData } from "../../components/Page";
import { Data as SiteData } from "../../components/Site";
import { Data as ImageData } from "../../components/Image";
import { Data as TitleWithContentData } from "../../components/TitleWithContent";

export type EsCollapsedTraining = {
  inner_hits: {
    inner_hits: {
      hits: {
        total: {
          value: number;
          relation: string;
        };
        max_score: number;
        hits: {
          _index: string;
          _type: "_doc";
          _id: string;
          _score: number;
          _source: Training;
        }[];
      };
    };
  };
  _source: Training;
};

export type EsTrainingHit = {
  _index: string;
  _type: "_doc";
  _id: string;
  _score: number;
  _source: Training;
};

export type EsResponse<T extends EsCollapsedTraining | EsTrainingHit> = {
  hits: {
    total: {
      value: number;
      relation: string;
    };
    max_score: number | null;
    hits: T[];
  };
};

export type TrainingListerPageData = Omit<PageData, "signupBlock"> & {
  __typename: "ContentfulTrainingListerPage";
  title: string;
  subtitle: string | null;
  breadcrumbTitle: string | null;
  featuredMedia: ImageData;
  searchTips: TitleWithContentData;
};

export type TrainingListerPageProps = {
  data: {
    contentfulTrainingListerPage: TrainingListerPageData;
    contentfulSite: SiteData;
  };
  pageContext: {
    variantCodeToPathMap?: Record<string, string>;
  };
};

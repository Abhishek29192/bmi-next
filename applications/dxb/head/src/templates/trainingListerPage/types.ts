import type { Training } from "@bmi/elasticsearch-types";
import type { Filter } from "@bmi-digital/components/filters";
import type { Data as ImageData } from "../../components/image/ContentfulImage";
import type { Data as PageData } from "../../components/Page";
import type { Data as SiteData } from "../../components/Site";
import type { Data as TitleWithContentData } from "../../components/TitleWithContent";
import type { Aggregations } from "../../utils/elasticSearch";

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

export type EsCommonResponse<T extends EsCollapsedTraining | EsTrainingHit> = {
  hits: {
    total: {
      value: number;
      relation: string;
    };
    max_score: number | null;
    hits: T[];
  };
};

export type PaginatedTrainingResponse = EsCommonResponse<EsTrainingHit>;

export type CollapsedTrainingResponse =
  EsCommonResponse<EsCollapsedTraining> & { aggregations: Aggregations };

export type TrainingListerPageData = Omit<PageData, "signupBlock"> & {
  __typename: "ContentfulTrainingListerPage";
  title: string;
  subtitle: string | null;
  breadcrumbTitle: string | null;
  featuredMedia: ImageData;
  filters: Filter[];
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

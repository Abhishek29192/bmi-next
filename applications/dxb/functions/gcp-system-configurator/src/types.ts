import { EntryFields } from "contentful";

export type NextStep = Result | Question | TitleWithContent;

type Entry = {
  sys: {
    id: string;
  };
  title: string;
  description: {
    json: EntryFields.RichText;
    links: {
      assets: {
        block: Asset[];
      };
    };
  } | null;
};

export type Answer = {
  __typename: "SystemConfiguratorAnswer";
  nextStep: NextStep;
} & Entry;

type Result = {
  __typename: "SystemConfiguratorResult";
  recommendedSystems: string[];
} & Entry;

type Question = {
  __typename: "SystemConfiguratorQuestion";
  answersCollection: {
    total: number;
    items: Omit<Answer, "nextStep">[];
  };
} & Entry;

type TitleWithContent = {
  __typename: "TitleWithContent";
  sys: {
    id: string;
  };
  title: string;
  content: { json: any; links: null };
};

type Asset = {
  __typename: "Asset";
  sys: {
    id: string;
  };
  title: string | null;
  url: string | null;
  contentType: string | null;
};

type ResponseRichText = {
  raw: string;
  references: Array<{
    __typename: "ContentfulAsset";
    contentful_id: string;
    id: string;
    title: string | null;
    file: {
      url: string;
      contentType: string;
    };
  }>;
};

type TransformedBase = { contentful_id: string; id: string; title: string };

export type TransformedAnswer = TransformedBase & {
  __typename: `ContentfulSystemConfiguratorAnswer`;
  description: ResponseRichText | null;
};

export type Response = TransformedBase &
  (
    | {
        __typename: `ContentfulSystemConfiguratorQuestion`;
        description: ResponseRichText | null;
        answers: TransformedAnswer[];
      }
    | {
        __typename: `ContentfulSystemConfiguratorResult`;
        description: ResponseRichText | null;
        recommendedSystems: string[];
      }
    | {
        __typename: `ContentfulTitleWithContent`;
        content: { raw: string };
      }
  );

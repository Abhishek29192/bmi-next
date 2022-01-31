import { EntryFields } from "contentful";

export type Answer = {
  nextStep: NextStep | null;
};

export type NextStep = Entry | TitleWithContent;

type Entry = {
  __typename: "SystemConfiguratorBlock";
  sys: {
    id: string;
  };
  title: string;
  type: Type;
  description: {
    json: EntryFields.RichText;
    links: {
      assets: {
        block: Asset[];
      };
    };
  } | null;
} & Partial<Question> &
  Partial<Result>;

type Result = {
  recommendedSystems: string[] | null;
};

type Question = {
  answersCollection: {
    total: number;
    items: Entry[];
  } | null;
};

type TitleWithContent = {
  __typename: "TitleWithContent";
  sys: {
    id: string;
  };
  title: string;
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

export type Type = "Question" | "Result";

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

export type Response = {
  contentful_id: string;
  id: string;
  title: string;
} & (
  | {
      __typename: `ContentfulSystemConfiguratorBlock`;
      type: string;
      description: ResponseRichText | null;
      answers: Response[] | null;
      recommendedSystems: string[] | null;
    }
  | {
      __typename: `ContentfulTitleWithContent`;
      type: null;
      answers: null;
      recommendedSystems: null;
    }
);

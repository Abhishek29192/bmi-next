import React, {
  useCallback,
  useContext,
  useState,
  useEffect,
  createContext,
  ChangeEvent
} from "react";
import { graphql } from "gatsby";
import axios, { AxiosResponse, CancelToken } from "axios";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import ConfiguratorPanel from "@bmi/configurator-panel";
import Section from "@bmi/section";
import RadioPane from "@bmi/radio-pane";
import Grid from "@bmi/grid";
import OverviewCard from "@bmi/overview-card";
import Scrim from "../components/Scrim";
import ProgressIndicator from "../components/ProgressIndicator";
import RichText, { RichTextData } from "./RichText";
import { Data as DefaultTitleWithContentData } from "./TitleWithContent";

export type Data = {
  __typename: "ContentfulSystemConfiguratorBlock";
  locale: string;
  title: string;
  label: string;
  description: RichTextData | null;
  question: Partial<EntryData>;
  type: "Section";
  noResultItems: TitleWithContentData[];
};

export type NextStepData = Partial<EntryData> | TitleWithContentData;

type EntryData = {
  __typename: "ContentfulSystemConfiguratorBlock";
  id: string;
  title: string;
  type: "Question" | "Answer" | "Result";
  description: RichTextData | null;
} & QuestionData &
  ResultData;

type QuestionData = {
  answers: Partial<EntryData>[] | null;
};

type TitleWithContentData = DefaultTitleWithContentData & {
  contentful_id: string;
};

type ResultData = {
  recommendedSystems: string[] | null;
};

type SystemConfiguratorBlockProps = {
  id: string;
  index: number;
  getData: (
    id: string,
    index: number,
    cancelToken: CancelToken
  ) => Promise<NextStepData>;
};

const SystemConfigurtorContext = createContext(undefined);

const SystemConfiguratorBlock = ({
  id,
  index,
  getData
}: SystemConfiguratorBlockProps) => {
  const [data, setData] = useState<NextStepData>(null);
  const [nextId, setNextId] = useState<string>(null);
  const { openIndex, setState } = useContext(SystemConfigurtorContext);

  useEffect(() => {
    const cancelTokenSource = axios.CancelToken.source();

    const fetchData = async () => {
      setState((state) => ({ ...state, isLoading: true }));
      const data = await getData(id, index, cancelTokenSource.token);
      if (data) {
        setData(data);
        setState((state) => ({
          ...state,
          isLoading: false
        }));
      }
    };

    fetchData();

    return () => cancelTokenSource.cancel();
  }, [id, index]);

  useEffect(() => {
    if (!data || nextId) {
      return;
    }

    if (
      data.__typename === "ContentfulSystemConfiguratorBlock" &&
      data.type === "Result"
    ) {
      setState((state) => ({ ...state, result: data, noResult: null }));
    }

    if (data.__typename === "ContentfulTitleWithContent") {
      setState((state) => ({ ...state, result: null, noResult: data }));
    }

    return () => {
      setState((state) => ({ ...state, result: null, noResult: null }));
    };
  }, [data]);

  if (
    !data ||
    data.__typename !== "ContentfulSystemConfiguratorBlock" ||
    data.type !== "Question"
  ) {
    return null;
  }

  const { type, title, ...rest } = data;

  const { answers = [], description } = rest;

  const handleOnChange = (event: ChangeEvent<{}>, isExpanded: boolean) => {
    if (!isExpanded) {
      setState((state) => ({ ...state, openIndex: null }));
      return;
    }

    setState((state) => ({ ...state, openIndex: index }));
  };

  const selectedAnswer =
    answers.find(({ id }) => id === nextId) ||
    (answers.length === 1 && answers[0]);

  return (
    <>
      <ConfiguratorPanel
        title={title}
        selectedOptionTitle={selectedAnswer?.title}
        isExpanded={!selectedAnswer?.id || openIndex === index}
        disabled={!selectedAnswer?.id}
        handleOnChange={handleOnChange}
        options={answers.map(({ id, title: answerTitle, description }) => {
          return (
            <RadioPane
              key={id}
              title={answerTitle}
              name={title}
              value={answerTitle}
              onClick={() => {
                setNextId(id);
                setState((state) => ({ ...state, openIndex: null }));
              }}
              defaultChecked={id === selectedAnswer?.id}
            >
              {description && <RichText document={description} />}
            </RadioPane>
          );
        })}
      >
        {description && <RichText document={description} />}
      </ConfiguratorPanel>
      {selectedAnswer ? (
        <SystemConfiguratorBlock
          key={selectedAnswer?.id}
          id={selectedAnswer?.id}
          index={index + 1}
          getData={getData}
        />
      ) : null}
    </>
  );
};

const SystemConfiguratorBlockNoResultsSection = ({
  title,
  content
}: Partial<TitleWithContentData>) => {
  return (
    <Section backgroundColor="alabaster">
      <Section.Title>{title}</Section.Title>
      {content && <RichText document={content} />}
    </Section>
  );
};

const SystemConfiguratorBlockResultSection = ({
  title,
  description,
  recommendedSystems
}: Partial<EntryData>) => {
  return (
    <Section backgroundColor="white">
      <Section.Title>{title}</Section.Title>
      {description && <RichText document={description} />}
      {recommendedSystems && (
        <Grid container spacing={3}>
          {recommendedSystems.map((system) => (
            <Grid item key={system} xs={12} md={6} lg={4} xl={3}>
              <OverviewCard
                title={`System-${system}`}
                titleVariant="h5"
                subtitleVariant="h6"
                imageSize="contain"
                buttonComponent={"div"}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Section>
  );
};

type SystemConfiguratorSectionState = {
  isLoading: boolean;
  openIndex: number | null;
  result: EntryData | null;
  noResult: Omit<TitleWithContentData, "content"> | null;
  error: Error | null;
};

const SystemConfiguratorSection = ({ data }: { data: Data }) => {
  const { title, description, type, question, locale, noResultItems } = data;
  const [state, setState] = useState<SystemConfiguratorSectionState>({
    isLoading: false,
    openIndex: null,
    result: null,
    noResult: null,
    error: null
  });

  const { isLoading } = state;
  /* istanbul ignore next */
  if (type !== "Section" && process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.error(
      `Entry ContentfulSystemConfiguratorBlock "${data.label}" type "${type}" is not of type "Section"`
    );
  }

  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleAnswerChange = useCallback(
    async (answerId, index, cancelToken): Promise<NextStepData> => {
      if (index === 0) {
        return Promise.resolve(question);
      }

      const token = await executeRecaptcha();

      try {
        const { data }: AxiosResponse = await axios.get(
          `${process.env.GATSBY_GCP_SYSTEM_CONFIGURATOR_ENDPOINT}`,
          {
            headers: { "X-Recaptcha-Token": token },
            params: {
              answerId,
              locale: locale
            },
            cancelToken
          }
        );

        return data;
      } catch (error) {
        handleError(error);
      }
    },
    []
  );

  const handleError = useCallback((error) => {
    /* istanbul ignore next */
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.error(error);
      return;
    }
    setState((state) => ({ ...state, error }));
  }, []);

  const noResult = state.noResult && {
    ...state.noResult,
    ...(noResultItems.find(
      ({ contentful_id }) => contentful_id === state.noResult.contentful_id
    ) || {})
  };

  if (state.error) {
    throw state.error;
  }

  return (
    <>
      {isLoading ? (
        <Scrim theme="light">
          <ProgressIndicator theme="light" />
        </Scrim>
      ) : null}
      <Section backgroundColor="white">
        <Section.Title>{title}</Section.Title>
        {description && <RichText document={description} />}
        {question && (
          <SystemConfigurtorContext.Provider value={{ ...state, setState }}>
            <SystemConfiguratorBlock
              key={question.id}
              index={0}
              id={question.id}
              getData={(answerId, index, cancelToken) =>
                handleAnswerChange(answerId, index, cancelToken)
              }
            />
          </SystemConfigurtorContext.Provider>
        )}
      </Section>
      {state.result && (
        <SystemConfiguratorBlockResultSection {...state.result} />
      )}
      {noResult && <SystemConfiguratorBlockNoResultsSection {...noResult} />}
    </>
  );
};

export default SystemConfiguratorSection;

export const query = graphql`
  fragment SystemConfiguratorBlockFragment on ContentfulSystemConfiguratorBlock {
    title
    locale: node_locale
    description {
      ...RichTextFragment
    }
    type
    label
    question {
      __typename
      id: contentful_id
      title
      description {
        ...RichTextFragment
      }
      type
      recommendedSystems
      answers {
        __typename
        id: contentful_id
        title
        description {
          ...RichTextFragment
        }
        type
      }
    }
    noResultItems {
      contentful_id
      ...TitleWithContentFragment
    }
  }
`;

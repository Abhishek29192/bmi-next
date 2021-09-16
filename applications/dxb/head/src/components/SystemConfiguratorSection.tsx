import React, {
  useCallback,
  useContext,
  useState,
  useEffect,
  createContext,
  ChangeEvent,
  useLayoutEffect
} from "react";
import { graphql } from "gatsby";
import axios, { AxiosResponse, CancelToken } from "axios";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import ConfiguratorPanel from "@bmi/configurator-panel";
import Section from "@bmi/section";
import RadioPane from "@bmi/radio-pane";
import Grid from "@bmi/grid";
import OverviewCard, { OverviewCardProps } from "@bmi/overview-card";
import { Link as GatsbyLink } from "gatsby";
import { useLocation } from "@reach/router";
import Scrim from "../components/Scrim";
import ProgressIndicator from "../components/ProgressIndicator";
import * as storage from "../utils/storage";
import { useScrollToOnLoad } from "../utils/useScrollToOnLoad";
import withGTM from "../utils/google-tag-manager";
import RichText, { RichTextData } from "./RichText";
import { Data as DefaultTitleWithContentData } from "./TitleWithContent";
import { useSiteContext } from "./Site";

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

type StoredStateType = {
  selectedAnswers: Array<string>;
  selectedSystem: string;
};
const initialStorageState: StoredStateType = {
  selectedAnswers: [],
  selectedSystem: ""
};

type EntryData = {
  __typename: "ContentfulSystemConfiguratorBlock";
  id: string;
  title: string;
  type: "Question" | "Answer" | "Result";
  description: RichTextData | null;
  selectedSystem?: string;
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
    cancelToken: CancelToken,
    recaptchaToken: string
  ) => Promise<NextStepData>;
  storedAnswers?: string[];
  stateSoFar?: string[];
};

const ACCORDION_TRANSITION = 500;

const SystemConfigurtorContext = createContext(undefined);

const saveStateToLocalStorage = (stateToStore: string) => {
  storage.local.setItem(SYSTEM_CONFIG_STORAGE_KEY, stateToStore);
};

const SystemConfiguratorBlock = ({
  id,
  index,
  getData,
  storedAnswers,
  stateSoFar = []
}: SystemConfiguratorBlockProps) => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [myStoredAnswerId, ...remainingStoredAnswers] = storedAnswers;
  const [data, setData] = useState<NextStepData>(null);
  const [nextId, setNextId] = useState<string>(myStoredAnswerId);
  const { openIndex, setState } = useContext(SystemConfigurtorContext);

  const allStateSoFar = [...stateSoFar, nextId];

  useEffect(() => {
    const cancelTokenSource = axios.CancelToken.source();

    const fetchData = async () => {
      setState((state) => ({ ...state, isLoading: true }));
      const token = await executeRecaptcha();
      const data = await getData(id, index, cancelTokenSource.token, token);
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

  const questionData =
    data &&
    data.__typename === "ContentfulSystemConfiguratorBlock" &&
    data.type === "Question"
      ? data
      : null;

  const ref = useScrollToOnLoad(
    index === 0 || !questionData,
    ACCORDION_TRANSITION
  );

  if (!questionData) {
    return null;
  }

  const { type, title, ...rest } = questionData;

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
        ref={ref}
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
                const stateToSave = JSON.stringify({
                  selectedAnswers: [...stateSoFar, id]
                });
                saveStateToLocalStorage(stateToSave);
              }}
              defaultChecked={id === selectedAnswer?.id}
            >
              {description && <RichText document={description} />}
            </RadioPane>
          );
        })}
        TransitionProps={{
          timeout: ACCORDION_TRANSITION
        }}
      >
        {description && <RichText document={description} />}
      </ConfiguratorPanel>
      {selectedAnswer ? (
        <SystemConfiguratorBlock
          key={selectedAnswer?.id}
          id={selectedAnswer?.id}
          index={index + 1}
          getData={getData}
          storedAnswers={remainingStoredAnswers}
          stateSoFar={allStateSoFar}
        />
      ) : null}
    </>
  );
};

const SystemConfiguratorBlockNoResultsSection = ({
  title,
  content
}: Partial<TitleWithContentData>) => {
  const ref = useScrollToOnLoad(false, ACCORDION_TRANSITION);

  return (
    <div ref={ref}>
      <Section backgroundColor="alabaster">
        <Section.Title>{title}</Section.Title>
        {content && <RichText document={content} />}
      </Section>
    </div>
  );
};

const GTMOverviewCard = withGTM<OverviewCardProps>(OverviewCard, {
  label: "title"
});

const SystemConfiguratorBlockResultSection = ({
  title,
  description,
  recommendedSystems,
  selectedSystem: _selectedSystem
}: Partial<EntryData>) => {
  const ref = useScrollToOnLoad(false, ACCORDION_TRANSITION);
  const { countryCode } = useSiteContext();
  // put this line at line 258 when implementing card highlight
  // isHighlighted={selectedSystem === system}
  return (
    <div ref={ref}>
      <Section backgroundColor="white">
        <Section.Title>{title}</Section.Title>
        {description && <RichText document={description} />}
        {recommendedSystems && (
          <Grid container spacing={3}>
            {recommendedSystems.map((system) => (
              <Grid item key={system} xs={12} md={6} lg={4} xl={3}>
                <GTMOverviewCard
                  title={`System-${system}`}
                  titleVariant="h5"
                  subtitleVariant="h6"
                  imageSize="contain"
                  gtm={{
                    event: `${title}-results`,
                    id: system,
                    action: `/${countryCode}/system-details-page?selected_system=${system}`
                  }}
                  action={{
                    model: "routerLink",
                    linkComponent: GatsbyLink,
                    to: `/${countryCode}/system-details-page?selected_system=${system}`
                  }}
                  onClick={() => {
                    const storedState = storage.local.getItem(
                      SYSTEM_CONFIG_STORAGE_KEY
                    );
                    const stateObject = JSON.parse(storedState || "");
                    const newState = { ...stateObject, selectedSystem: system };
                    saveStateToLocalStorage(JSON.stringify(newState));
                  }}
                  isHighlighted={false}
                >
                  {undefined}
                </GTMOverviewCard>
              </Grid>
            ))}
          </Grid>
        )}
      </Section>
    </div>
  );
};

type SystemConfiguratorSectionState = {
  isLoading: boolean;
  openIndex: number | null;
  result: EntryData | null;
  noResult: Omit<TitleWithContentData, "content"> | null;
  error: Error | null;
};

const SYSTEM_CONFIG_QUERY_KEY = "referer";
const SYSTEM_CONFIG_STORAGE_KEY = "SystemConfiguratorBlock";
const VALID_REFERER = "sys_details";

const SystemConfiguratorSection = ({ data }: { data: Data }) => {
  const [referer, setReferer] = useState("");
  const [storedAnswers, setStoredAnswers] =
    useState<StoredStateType>(undefined);
  const location = useLocation();

  // useLayoutEffect for getting value from local storage
  // as Local storage in ssr value appears after first rendering
  // see useStickyState hook
  useLayoutEffect(() => {
    const urlReferer = new URLSearchParams(location.search).get(
      SYSTEM_CONFIG_QUERY_KEY
    );
    const storedValues = storage.local.getItem(SYSTEM_CONFIG_STORAGE_KEY);
    setReferer(urlReferer);

    setStoredAnswers(
      urlReferer === VALID_REFERER && storedValues
        ? JSON.parse(storedValues)
        : initialStorageState
    );
  }, []);

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

  const handleAnswerChange = useCallback(
    async (
      answerId,
      index,
      cancelToken,
      recaptchaToken
    ): Promise<NextStepData> => {
      if (index === 0) {
        return Promise.resolve(question);
      }

      try {
        const { data }: AxiosResponse = await axios.get(
          `${process.env.GATSBY_GCP_SYSTEM_CONFIGURATOR_ENDPOINT}`,
          {
            headers: { "X-Recaptcha-Token": recaptchaToken },
            params: {
              answerId: answerId,
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

  useEffect(() => {
    // delete the storage and remove the referer from location bar
    // if the page is fully loaded
    if (
      referer === VALID_REFERER &&
      !state.isLoading &&
      history &&
      (state.result !== null || state.noResult !== null)
    ) {
      history.replaceState(null, null, location.pathname);
      setStoredAnswers(initialStorageState);
    }
  }, [referer, state]);

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
        {question && storedAnswers ? (
          <SystemConfigurtorContext.Provider value={{ ...state, setState }}>
            <SystemConfiguratorBlock
              key={question.id}
              index={0}
              id={question.id}
              getData={(answerId, index, cancelToken, recaptchaToken) =>
                handleAnswerChange(answerId, index, cancelToken, recaptchaToken)
              }
              storedAnswers={storedAnswers.selectedAnswers}
            />
          </SystemConfigurtorContext.Provider>
        ) : null}
      </Section>
      {state.result && (
        <SystemConfiguratorBlockResultSection
          {...state.result}
          selectedSystem={storedAnswers.selectedSystem}
        />
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

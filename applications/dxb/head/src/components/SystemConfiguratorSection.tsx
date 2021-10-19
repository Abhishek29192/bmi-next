import { graphql } from "gatsby";
import React, {
  ChangeEvent,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState
} from "react";
import axios, { AxiosResponse, CancelToken } from "axios";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import ConfiguratorPanel from "@bmi/configurator-panel";
import Section from "@bmi/section";
import RadioPane, { RadioPaneProps } from "@bmi/radio-pane";
import Grid from "@bmi/grid";
import { useLocation, navigate } from "@reach/router";
import { SystemCard } from "../components/RelatedSystems";
import ProgressIndicator from "../components/ProgressIndicator";
import Scrim from "../components/Scrim";
import { SYSTEM_CONFIG_QUERY_KEY_REFERER } from "../constants/queryConstants";
import withGTM, { pushToDataLayer } from "../utils/google-tag-manager";
import * as storage from "../utils/storage";
import { useScrollToOnLoad } from "../utils/useScrollToOnLoad";
import { queryElasticSearch } from "../utils/elasticSearch";
import { generateSystemPath } from "../utils/systems";
import { getPathWithCountryCode } from "../utils/path";
import { System } from "./types/pim";
import RichText, { RichTextData } from "./RichText";
import { useSiteContext } from "./Site";
import styles from "./styles/SystemConfiguratorSection.module.scss";
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

type StoredStateType = {
  selectedAnswers: Array<string>;
};
const initialStorageState: StoredStateType = {
  selectedAnswers: []
};

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
    cancelToken: CancelToken,
    recaptchaToken: string
  ) => Promise<NextStepData>;
  storedAnswers?: string[];
  stateSoFar?: string[];
  isReload: boolean;
};

const ACCORDION_TRANSITION = 500;

const SystemConfigurtorContext = createContext(undefined);

const saveStateToLocalStorage = (stateToStore: string) => {
  storage.local.setItem(SYSTEM_CONFIG_STORAGE_KEY, stateToStore);
};

const ES_INDEX_NAME = process.env.GATSBY_ES_INDEX_NAME_SYSTEMS;

const GTMRadioPane = withGTM<RadioPaneProps>(RadioPane);

const SystemConfiguratorBlock = ({
  id,
  index,
  getData,
  storedAnswers,
  stateSoFar = [],
  isReload
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

  const { type, title, ...rest } = questionData || {};

  const { answers = [], description } = rest;

  const handleOnChange = (event: ChangeEvent<{}>, isExpanded: boolean) => {
    if (!isExpanded) {
      setState((state) => ({ ...state, openIndex: null }));
      return;
    }

    setState((state) => ({ ...state, openIndex: index }));
  };

  const hasSingleAnswer = answers.length === 1 && answers[0];
  const selectedAnswer =
    answers.find(({ id }) => id === nextId) || hasSingleAnswer;

  useEffect(() => {
    if (hasSingleAnswer && !isReload) {
      pushToDataLayer({
        id: `system-configurator01-selected`,
        label: title,
        action: selectedAnswer.title
      });
    }
  }, [hasSingleAnswer, isReload]);

  if (!questionData) {
    return null;
  }

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
            <GTMRadioPane
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
              gtm={{
                id: "system-configurator01-selected",
                label: title,
                action: answerTitle
              }}
            >
              {description && <RichText document={description} />}
            </GTMRadioPane>
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
          isReload={isReload}
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

  useEffect(() => {
    pushToDataLayer({
      id: "system-configurator01-results",
      event: "gtm.click",
      label: "No system found",
      action: "No system found"
    });
  }, []);

  return (
    <div ref={ref}>
      <Section backgroundColor="alabaster">
        <Section.Title>{title}</Section.Title>
        {content && <RichText document={content} />}
      </Section>
    </div>
  );
};

const SystemConfiguratorBlockResultSection = ({
  title,
  description,
  recommendedSystems
}: Partial<EntryData>) => {
  const maxDisplay = 4;
  const ref = useScrollToOnLoad(false, ACCORDION_TRANSITION);
  const { countryCode } = useSiteContext();
  const [recommendedSystemPimObjects, setRecommendedSystemPimObjects] =
    useState<Partial<System>[]>([]);

  useEffect(() => {
    const fetchESData = async () => {
      const query = {
        query: {
          terms: {
            "code.keyword": recommendedSystems
          }
        }
      };
      try {
        const response = await queryElasticSearch(query, ES_INDEX_NAME);
        if (response.hits?.total.value > 0) {
          const pimObject = response.hits?.hits.map(({ _source }) => {
            return {
              ..._source,
              path: generateSystemPath(_source)
            };
          });
          setRecommendedSystemPimObjects(
            pimObject
              .slice(0, maxDisplay)
              .sort(
                (systemA, systemB) =>
                  recommendedSystems.indexOf(systemA.code) -
                  recommendedSystems.indexOf(systemB.code)
              )
          );
        } else {
          navigate("/404");
        }
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          // eslint-disable-next-line no-console
          console.error(error);
        }
        navigate("/404");
      }
    };

    if (recommendedSystems.length > 0) {
      fetchESData();
    } else {
      setRecommendedSystemPimObjects([]);
    }
  }, [recommendedSystems]);

  return (
    <div ref={ref}>
      <Section
        backgroundColor="pearl"
        className={styles["SystemConfigurator-result"]}
      >
        <Section.Title className={styles["title"]}>{title}</Section.Title>
        {description && (
          <div className={styles["description"]}>
            <RichText document={description} />
          </div>
        )}
        {recommendedSystems.length > 0 &&
          recommendedSystemPimObjects.length > 0 && (
            <Grid container spacing={3}>
              {recommendedSystemPimObjects.map((system, id) => {
                const linkToSDP = `${system.path}/?selected_system=${system.code}&prev_page=/${countryCode}/system-configurator-page&referer=sys_details`;
                return (
                  <SystemCard
                    key={`${system.code}-${id}`}
                    system={system}
                    countryCode={countryCode}
                    gtm={{
                      id: "system-configurator01-results",
                      action: getPathWithCountryCode(countryCode, linkToSDP),
                      label: system.name
                    }}
                    path={linkToSDP}
                    isHighlighted={id === 0}
                  />
                );
              })}
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
      SYSTEM_CONFIG_QUERY_KEY_REFERER
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
      <Section backgroundColor="white" className={styles["SystemConfigurator"]}>
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
              isReload={(referer || "").length > 0}
            />
          </SystemConfigurtorContext.Provider>
        ) : null}
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

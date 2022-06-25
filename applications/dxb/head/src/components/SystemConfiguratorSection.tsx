import { Grid, RadioPane, RadioPaneProps, Section } from "@bmi/components";
import { System as EsSystem } from "@bmi/elasticsearch-types";
import { navigate, useLocation } from "@reach/router";
import { graphql } from "gatsby";
import fetch, { Response } from "node-fetch";
import React, {
  ChangeEvent,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState
} from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { SYSTEM_CONFIG_QUERY_KEY_REFERER } from "../constants/queryConstants";
import { useConfig } from "../contexts/ConfigProvider";
import { devLog } from "../utils/devLog";
import { queryElasticSearch } from "../utils/elasticSearch";
import withGTM, { pushToDataLayer } from "../utils/google-tag-manager";
import { getPathWithCountryCode } from "../utils/path";
import * as storage from "../utils/storage";
import { useScrollToOnLoad } from "../utils/useScrollToOnLoad";
import ConfiguratorPanel from "./configurator-panel/ConfiguratorPanel";
import ProgressIndicator from "./ProgressIndicator";
import { SystemCard } from "./RelatedSystems";
import RichText, { RichTextData } from "./RichText";
import Scrim from "./Scrim";
import { useSiteContext } from "./Site";
import styles from "./styles/SystemConfiguratorSection.module.scss";
import { Data as DefaultTitleWithContentData } from "./TitleWithContent";

export type Data = {
  __typename: "ContentfulSystemConfiguratorBlock";
  locale: string;
  title: string;
  label: string;
  description: RichTextData | null;
  question: QuestionData;
  type: "Section";
};

export type NextStepData = {
  nextQuestion?: QuestionData;
  nextResult?: ResultData;
  nextNoResult?: TitleWithContentData;
};

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
  description: RichTextData | null;
};

export type AnswerData = EntryData & {
  type: "Answer";
};

export type QuestionData = EntryData & {
  type: "Question";
  answers: AnswerData[];
};

export type TitleWithContentData = DefaultTitleWithContentData & {
  contentful_id: string;
};

export type ResultData = EntryData & {
  type: "Result";
  recommendedSystems: string[] | null;
};

type SystemConfiguratorSectionState = {
  locale: string;
  isLoading: boolean;
  isComplete: boolean;
  openIndex?: number;
  result?: ResultData;
  noResult?: TitleWithContentData;
  error?: Error;
};

const ACCORDION_TRANSITION = 500;

const SystemConfiguratorContext = createContext<
  SystemConfiguratorSectionState & {
    setState: React.Dispatch<
      React.SetStateAction<SystemConfiguratorSectionState>
    >;
  }
>(undefined);

const saveStateToLocalStorage = (stateToStore: string) => {
  storage.local.setItem(SYSTEM_CONFIG_STORAGE_KEY, stateToStore);
};

const GTMRadioPane = withGTM<RadioPaneProps>(RadioPane);

type SystemConfiguratorQuestionData = {
  index: number;
  id: string;
  question: QuestionData;
  storedAnswers: string[];
  isReload: boolean;
  stateSoFar?: string[];
};

const SystemConfiguratorQuestion = ({
  index,
  id, // TODO: Is this still needed? I have a feeling it has some odd reason to exist
  question,
  storedAnswers,
  isReload,
  stateSoFar = []
}: SystemConfiguratorQuestionData) => {
  const [myStoredAnswerId, ...remainingStoredAnswers] = storedAnswers;
  const [nextId, setNextId] = useState<string>(myStoredAnswerId);
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [nextStep, setNextStep] = useState<NextStepData>({});
  const { locale, openIndex, setState } = useContext(SystemConfiguratorContext);
  const ref = useScrollToOnLoad(index === 0, ACCORDION_TRANSITION);
  const {
    config: { gcpSystemConfiguratorEndpoint }
  } = useConfig();

  const singleAnswer =
    question.answers.length === 1 ? question.answers[0] : undefined;
  const selectedAnswer =
    question.answers.find(({ id }) => id === nextId) || singleAnswer;

  // Needed so the "go back to your selection" states aren't stored with the user interactions
  const allStateSoFar = [...stateSoFar, nextId];

  const getData = useCallback(async (answerId, locale) => {
    setState((state) => ({ ...state, isLoading: true }));

    const controller = new AbortController();

    const recaptchaToken = await executeRecaptcha();

    try {
      const response: Response = await fetch(
        `${gcpSystemConfiguratorEndpoint}?answerId=${answerId}&locale=locale`,
        {
          method: "GET",
          headers: { "X-Recaptcha-Token": recaptchaToken },
          signal: controller.signal
        }
      );

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const data: QuestionData | ResultData | TitleWithContentData =
        await response.json();

      if (data.__typename === "ContentfulTitleWithContent") {
        setNextStep({ nextNoResult: data });
        setState((state) => ({
          ...state,
          noResult: data,
          result: undefined,
          isLoading: false,
          isComplete: true
        }));
      } else if (data.type === "Question") {
        setNextStep({ nextQuestion: data });
        setState((state) => ({
          ...state,
          noResult: undefined,
          result: undefined,
          isLoading: false,
          isComplete: false
        }));
      } else if (data.type === "Result") {
        setNextStep({ nextResult: data });
        setState((state) => ({
          ...state,
          noResult: undefined,
          result: data,
          isLoading: false,
          isComplete: true
        }));
      }
    } catch (error) {
      devLog(error);
      controller.abort();
      setState((state) => ({
        ...state,
        error,
        isLoading: false
      }));
    }
  }, []);

  useEffect(() => {
    if ((selectedAnswer && isReload) || singleAnswer) {
      getData(selectedAnswer.id, locale);
    }

    if (singleAnswer && !isReload) {
      pushToDataLayer({
        id: `system-configurator01-selected-auto`,
        label: question.title,
        action: selectedAnswer.title,
        event: "dxb.button_click"
      });
    }
  }, [selectedAnswer, locale, isReload]);

  const handleOnChange = (
    event: ChangeEvent<Record<string, unknown>>,
    isExpanded: boolean
  ) => {
    if (!isExpanded) {
      setState((state) => ({ ...state, openIndex: null }));
      return;
    }

    setState((state) => ({ ...state, openIndex: index }));
  };

  return (
    <>
      <ConfiguratorPanel
        ref={ref}
        title={question.title}
        selectedOptionTitle={selectedAnswer?.title}
        isExpanded={!selectedAnswer?.id || openIndex === index}
        disabled={!selectedAnswer?.id}
        handleOnChange={handleOnChange}
        options={question.answers.map(
          ({ id, title: answerTitle, description }) => {
            return (
              <GTMRadioPane
                key={id}
                title={answerTitle}
                name={question.title}
                collapseFeature
                value={answerTitle}
                onClick={async () => {
                  await getData(id, locale);
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
                  label: question.title,
                  action: answerTitle
                }}
              >
                {description && <RichText document={description} />}
              </GTMRadioPane>
            );
          }
        )}
        TransitionProps={{
          timeout: ACCORDION_TRANSITION
        }}
      >
        {question.description && <RichText document={question.description} />}
      </ConfiguratorPanel>
      {selectedAnswer && nextStep.nextQuestion ? (
        <SystemConfiguratorQuestion
          key={selectedAnswer?.id}
          id={selectedAnswer?.id}
          index={index + 1}
          storedAnswers={remainingStoredAnswers}
          stateSoFar={allStateSoFar}
          isReload={isReload}
          question={nextStep.nextQuestion}
        />
      ) : null}
    </>
  );
};

const SystemConfiguratorNoResult = ({
  title,
  content
}: TitleWithContentData) => {
  const ref = useScrollToOnLoad(false, ACCORDION_TRANSITION);

  useEffect(() => {
    pushToDataLayer({
      id: "system-configurator01-results",
      label: "No system found",
      action: "No system found",
      event: "dxb.button_click"
    });
  }, []);

  return (
    <div ref={ref}>
      <Section backgroundColor="alabaster">
        <Section.Title>{title}</Section.Title>
        <RichText document={content} />
      </Section>
    </div>
  );
};

const SystemConfiguratorResult = ({
  title,
  description,
  recommendedSystems
}: ResultData) => {
  const maxDisplay = 4;
  const ref = useScrollToOnLoad(false, ACCORDION_TRANSITION);
  const { countryCode } = useSiteContext();
  const [recommendedSystemPimObjects, setRecommendedSystemPimObjects] =
    useState<EsSystem[]>([]);
  const {
    config: { esIndexNameSystem }
  } = useConfig();

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
        const response = await queryElasticSearch(query, esIndexNameSystem);
        if (response.hits?.total.value > 0) {
          const pimObject = response.hits!.hits.map(({ _source }) => {
            return {
              ..._source
            };
          });
          setRecommendedSystemPimObjects(
            pimObject
              .sort(
                (systemA, systemB) =>
                  recommendedSystems.indexOf(systemA.code) -
                  recommendedSystems.indexOf(systemB.code)
              )
              .slice(0, maxDisplay)
          );
        } else {
          navigate(getPathWithCountryCode(countryCode, "422"));
        }
      } catch (error) {
        devLog(error);
        navigate(getPathWithCountryCode(countryCode, "422"));
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
                const linkToSDP = `${system.path}/?selected_system=${system.code}&prev_page=${window.location.pathname}&referer=sys_details`;
                return (
                  <SystemCard
                    data-testid={system.code}
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

  const { title, description, type, question, locale } = data;
  const [state, setState] = useState<SystemConfiguratorSectionState>({
    locale: locale,
    isLoading: false,
    isComplete: false
  });

  const { isLoading } = state;
  /* istanbul ignore next */
  if (type !== "Section") {
    devLog(
      `Entry ContentfulSystemConfiguratorBlock "${data.label}" type "${type}" is not of type "Section"`
    );
  }

  useEffect(() => {
    if (referer === VALID_REFERER && state.isComplete && history) {
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
        {storedAnswers ? (
          <SystemConfiguratorContext.Provider value={{ ...state, setState }}>
            <SystemConfiguratorQuestion
              key={question.id}
              id={question.id}
              index={0}
              storedAnswers={storedAnswers.selectedAnswers}
              isReload={(referer || "").length > 0}
              question={question}
            />
          </SystemConfiguratorContext.Provider>
        ) : null}
      </Section>
      {state.result && <SystemConfiguratorResult {...state.result} />}
      {state.noResult && <SystemConfiguratorNoResult {...state.noResult} />}
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
        nextStep {
          ... on ContentfulSystemConfiguratorBlock {
            id: contentful_id
          }
          ... on ContentfulTitleWithContent {
            id: contentful_id
          }
        }
      }
    }
  }
`;

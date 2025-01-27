import Grid from "@bmi-digital/components/grid";
import RadioPane, { RadioPaneProps } from "@bmi-digital/components/radio-pane";
import Section from "@bmi-digital/components/section";
import { replaceSpaces } from "@bmi-digital/components/utils";
import { System as EsSystem } from "@bmi/elasticsearch-types";
import { navigate, useLocation } from "@reach/router";
// import { graphql } from "gatsby";
import fetch, { Response } from "node-fetch";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState
} from "react";
import {
  IGoogleReCaptchaConsumerProps,
  useGoogleReCaptcha
} from "react-google-recaptcha-v3";
import { QA_AUTH_TOKEN } from "../constants/cookieConstants";
import { SYSTEM_CONFIG_QUERY_KEY_REFERER } from "../constants/queryConstants";
import { useConfig } from "../contexts/ConfigProvider";
import { devLog } from "../utils/devLog";
import { queryElasticSearch } from "../utils/elasticSearch";
import getCookie from "../utils/getCookie";
import withGTM, { pushToDataLayer } from "../utils/google-tag-manager";
import { getPathWithCountryCode } from "../utils/path";
import * as storage from "../utils/storage";
import { useScrollToOnLoad } from "../utils/useScrollToOnLoad";
import ProgressIndicator from "./ProgressIndicator";
import { SystemCard } from "./RelatedSystems";
import RichText, { RichTextData } from "./RichText";
import Scrim from "./Scrim";
import { useSiteContext } from "./Site";
import { Data as DefaultTitleWithContentData } from "./TitleWithContent";
import ConfiguratorPanel from "./configurator-panel/ConfiguratorPanel";
import {
  StyledSectionDescription,
  StyledSectionTitle
} from "./styles/SystemConfiguratorSection.styles";

export type Data = {
  __typename: "ContentfulSystemConfiguratorSection";
  locale: string;
  title: string;
  label: string;
  description: RichTextData | null;
  question: QuestionData;
  systemProperties: string[] | null;
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
  id: string;
  title: string;
  description: RichTextData | null;
};

export type AnswerData = EntryData & {
  __typename: "ContentfulSystemConfiguratorAnswer";
  nextStep: NextStepData;
};

export type QuestionData = EntryData & {
  __typename: "ContentfulSystemConfiguratorQuestion";
  answers: AnswerData[];
};

export type TitleWithContentData = DefaultTitleWithContentData & {
  contentful_id: string;
};

export type ResultData = EntryData & {
  __typename: "ContentfulSystemConfiguratorResult";
  recommendedSystems: string[] | null;
  systemProperties: string[] | null;
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
  executeRecaptcha: IGoogleReCaptchaConsumerProps["executeRecaptcha"];
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
  executeRecaptcha,
  stateSoFar = []
}: SystemConfiguratorQuestionData) => {
  const [myStoredAnswerId, ...remainingStoredAnswers] = storedAnswers;
  const [nextId, setNextId] = useState<string>(myStoredAnswerId);
  const qaAuthToken = getCookie(QA_AUTH_TOKEN);
  const [nextStep, setNextStep] = useState<NextStepData>({});
  const { locale, openIndex, setState } = useContext(SystemConfiguratorContext);
  const ref = useScrollToOnLoad(index === 0, ACCORDION_TRANSITION);
  const { gcpSystemConfiguratorEndpoint } = useConfig();

  const singleAnswer =
    question.answers.length === 1 ? question.answers[0] : undefined;
  const selectedAnswer =
    question.answers.find(({ id }) => id === nextId) || singleAnswer;

  // Needed so the "go back to your selection" states aren't stored with the user interactions
  const allStateSoFar = [...stateSoFar, nextId];

  const getData = useCallback(
    async (answerId, locale) => {
      setState((state) => ({ ...state, isLoading: true }));

      const controller = new AbortController();

      const recaptchaToken = qaAuthToken
        ? undefined
        : await executeRecaptcha?.();

      let headers: HeadersInit = {
        "X-Recaptcha-Token": recaptchaToken
      };

      if (qaAuthToken) {
        headers = { ...headers, authorization: `Bearer ${qaAuthToken}` };
      }
      try {
        const response: Response = await fetch(
          `${gcpSystemConfiguratorEndpoint}?answerId=${answerId}&locale=${locale}`,
          {
            method: "GET",
            headers,
            signal: controller.signal
          }
        );

        if (!response.ok) {
          throw new Error(response.statusText);
        }

        const data = (await response.json()) as
          | QuestionData
          | ResultData
          | TitleWithContentData;

        if (data.__typename === "TitleWithContent") {
          setNextStep({ nextNoResult: data });
          setState((state) => ({
            ...state,
            noResult: data,
            result: undefined,
            isLoading: false,
            isComplete: true
          }));
        } else if (data.__typename === "ContentfulSystemConfiguratorQuestion") {
          setNextStep({ nextQuestion: data });
          setState((state) => ({
            ...state,
            noResult: undefined,
            result: undefined,
            isLoading: false,
            isComplete: false
          }));
        } else if (data.__typename === "ContentfulSystemConfiguratorResult") {
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
    },
    [executeRecaptcha]
  );

  useEffect(() => {
    if ((selectedAnswer && isReload) || singleAnswer) {
      getData(selectedAnswer?.id, locale);
    }

    if (singleAnswer && !isReload) {
      pushToDataLayer({
        id: `system-configurator01-selected-auto`,
        label: question.title,
        action: selectedAnswer?.title,
        event: "dxb.button_click"
      });
    }
  }, [selectedAnswer, locale, isReload]);

  const handleOnChange = (event: React.SyntheticEvent, isExpanded: boolean) => {
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
          executeRecaptcha={executeRecaptcha}
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
      <Section
        backgroundColor="alabaster"
        data-testid={`system-configuration-section-${replaceSpaces(title)}`}
      >
        <Section.Title>{title}</Section.Title>
        <RichText document={content} />
      </Section>
    </div>
  );
};

const SystemConfiguratorResult = ({
  title,
  description,
  recommendedSystems,
  systemProperties
}: ResultData) => {
  const maxDisplay = 4;
  const ref = useScrollToOnLoad(false, ACCORDION_TRANSITION);
  const { countryCode } = useSiteContext();
  const [recommendedSystemPimObjects, setRecommendedSystemPimObjects] =
    useState<EsSystem[]>([]);
  const { esIndexNameSystem } = useConfig();

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
                  recommendedSystems?.indexOf(systemA.code) -
                  recommendedSystems?.indexOf(systemB.code)
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

    if (recommendedSystems?.length > 0) {
      fetchESData();
    } else {
      setRecommendedSystemPimObjects([]);
    }
  }, [recommendedSystems]);

  return (
    <div ref={ref} data-testid="system-config-result">
      <Section
        backgroundColor="pearl"
        data-testid={`system-configuration-section-${replaceSpaces(title)}`}
      >
        <StyledSectionTitle>{title}</StyledSectionTitle>
        {description && (
          <StyledSectionDescription>
            <RichText document={description} />
          </StyledSectionDescription>
        )}
        {recommendedSystems &&
          recommendedSystems.length > 0 &&
          recommendedSystemPimObjects.length > 0 && (
            <Grid
              container
              spacing={3}
              data-testid="system-configuration-results-grid"
            >
              {recommendedSystemPimObjects.map((system, id) => {
                const linkToSDP = `${system.path}/?selected_system=${system.code}&prev_page=${window.location.pathname}&referer=sys_details`;
                return (
                  <SystemCard
                    data-testid={system.code}
                    key={`${system.code}-${id}`}
                    system={system}
                    systemPropertiesToDisplay={systemProperties || []}
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
  const { executeRecaptcha } = useGoogleReCaptcha();
  // useLayoutEffect for getting value from local storage
  // as Local storage in ssr value appears after first rendering
  // see useStickyState hook
  useLayoutEffect(() => {
    const urlReferer = new URLSearchParams(location.search).get(
      SYSTEM_CONFIG_QUERY_KEY_REFERER
    );
    const storedValues = storage.local.getItem(SYSTEM_CONFIG_STORAGE_KEY);
    setReferer(urlReferer ?? "");

    setStoredAnswers(
      urlReferer === VALID_REFERER && storedValues
        ? JSON.parse(storedValues)
        : initialStorageState
    );
  }, [location.search]);

  const { title, description, __typename, question, locale, systemProperties } =
    data;
  const [state, setState] = useState<SystemConfiguratorSectionState>({
    locale: locale,
    isLoading: false,
    isComplete: false
  });

  const { isLoading } = state;
  /* istanbul ignore next */
  if (__typename !== "ContentfulSystemConfiguratorSection") {
    devLog(
      `Entry ContentfulSystemConfiguratorSection "${data.label}" type "${__typename}" is not of type "Section"`
    );
  }

  useEffect(() => {
    if (referer === VALID_REFERER && state.isComplete && history) {
      history.replaceState(null, "", location.pathname);
      setStoredAnswers(initialStorageState);
    }
  }, [location.pathname, referer, state]);

  if (state.error) {
    throw state.error;
  }

  return (
    <>
      {isLoading || !executeRecaptcha ? (
        <Scrim theme="light">
          <ProgressIndicator theme="light" />
        </Scrim>
      ) : null}
      <Section
        backgroundColor="white"
        data-testid={`system-configuration-section-${replaceSpaces(title)}`}
      >
        <Section.Title>{title}</Section.Title>
        {description && <RichText document={description} />}
        {storedAnswers && executeRecaptcha ? (
          <SystemConfiguratorContext.Provider value={{ ...state, setState }}>
            <SystemConfiguratorQuestion
              key={question.id}
              id={question.id}
              index={0}
              storedAnswers={storedAnswers.selectedAnswers}
              isReload={(referer || "").length > 0}
              question={question}
              executeRecaptcha={executeRecaptcha}
            />
          </SystemConfiguratorContext.Provider>
        ) : null}
      </Section>
      {state.result && (
        <SystemConfiguratorResult
          {...state.result}
          systemProperties={systemProperties}
        />
      )}
      {state.noResult && <SystemConfiguratorNoResult {...state.noResult} />}
    </>
  );
};

export default SystemConfiguratorSection;

// export const query = graphql`
//   fragment SystemConfiguratorSectionFragment on ContentfulSystemConfiguratorSection {
//     __typename
//     title
//     locale: node_locale
//     description {
//       ...RichTextFragment
//     }
//     label
//     question {
//       ...SystemConfiguratorQuestionFragment
//     }
//     systemProperties
//   }
//   fragment SystemConfiguratorQuestionFragment on ContentfulSystemConfiguratorQuestion {
//     __typename
//     id: contentful_id
//     locale: node_locale
//     title
//     label
//     description {
//       ...RichTextFragment
//     }
//     answers {
//       ...SystemConfiguratorAnswerFragment
//     }
//   }
//   fragment SystemConfiguratorAnswerFragment on ContentfulSystemConfiguratorAnswer {
//     __typename
//     id: contentful_id
//     locale: node_locale
//     title
//     label
//     description {
//       ...RichTextFragment
//     }
//     nextStep {
//       ... on ContentfulSystemConfiguratorQuestion {
//         id: contentful_id
//       }
//       ... on ContentfulTitleWithContent {
//         id: contentful_id
//       }
//       ... on ContentfulSystemConfiguratorResult {
//         id: contentful_id
//       }
//     }
//   }
//   fragment SystemConfiguratorResultFragment on ContentfulSystemConfiguratorResult {
//     __typename
//     id: contentful_id
//     locale: node_locale
//     title
//     label
//     description {
//       ...RichTextFragment
//     }
//     recommendedSystems
//   }
// `;

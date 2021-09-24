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
import { useLocation, navigate } from "@reach/router";
import Button, { ButtonProps } from "@bmi/button";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import { SystemCard, SystemCardProps } from "../components/RelatedSystems";
import Scrim from "../components/Scrim";
import ProgressIndicator from "../components/ProgressIndicator";
import * as storage from "../utils/storage";
import { useScrollToOnLoad } from "../utils/useScrollToOnLoad";
import withGTM from "../utils/google-tag-manager";
import { SystemDetails } from "../templates/systemDetails/types";
import RichText, { RichTextData } from "./RichText";
import { Data as DefaultTitleWithContentData } from "./TitleWithContent";
import { useSiteContext } from "./Site";
import styles from "./styles/SystemConfiguratorSection.module.scss";

export type Data = {
  __typename: "ContentfulSystemConfiguratorBlock";
  locale: string;
  title: string;
  label: string;
  description: RichTextData | null;
  question: Partial<EntryData>;
  type: "Section";
  noResultItems: TitleWithContentData[];
  pimSystems: Partial<SystemDetails>[];
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
  ResultData &
  PimSystems;

type QuestionData = {
  answers: Partial<EntryData>[] | null;
};

type TitleWithContentData = DefaultTitleWithContentData & {
  contentful_id: string;
};

type ResultData = {
  recommendedSystems: string[] | null;
};

type PimSystems = {
  pimSystems: Partial<SystemDetails>[];
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

type GTMSystemCardProps = {
  onClick: Function;
  footer: React.ReactElement<ButtonProps>;
} & SystemCardProps;

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

const GTMSystemCard = withGTM<GTMSystemCardProps>(SystemCard, {
  label: "title"
});

const SystemConfiguratorBlockResultSection = ({
  title,
  description,
  recommendedSystems,
  pimSystems,
  selectedSystem: _selectedSystem
}: Partial<EntryData>) => {
  const maxDisplay = 4;
  const ref = useScrollToOnLoad(false, ACCORDION_TRANSITION);
  const { countryCode } = useSiteContext();
  const [recommendedSystemPimObjects, setRecommendedSystemPimObjects] =
    useState<Partial<SystemDetails>[]>([]);

  useEffect(() => {
    const recommendedSystemPimObjects = recommendedSystems
      .map((systemId) => {
        return pimSystems.find(({ code }) => code === systemId);
      })
      .filter((object) => !!object);
    if (recommendedSystemPimObjects.length <= 0) {
      navigate("/404");
    } else {
      setRecommendedSystemPimObjects(
        recommendedSystemPimObjects.slice(0, maxDisplay)
      );
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
          recommendedSystemPimObjects.length > 0 &&
          recommendedSystemPimObjects.map((system, id) => {
            return (
              <Grid container spacing={3} key={`${system.code}-${id}`}>
                {
                  <GTMSystemCard
                    system={system}
                    countryCode={countryCode}
                    className={styles["OverviewCard"]}
                    gtm={{
                      event: `${title}-results`,
                      id: system.code,
                      action: `/${countryCode}/system-details-page?selected_system=${system.code}`
                    }}
                    path={`system-details-page?selected_system=${system.code}`}
                    onClick={() => {
                      const storedState = storage.local.getItem(
                        SYSTEM_CONFIG_STORAGE_KEY
                      );
                      const stateObject = JSON.parse(storedState || "");
                      const newState = {
                        ...stateObject,
                        selectedSystem: system.code
                      };
                      saveStateToLocalStorage(JSON.stringify(newState));
                    }}
                    footer={
                      <Button
                        startIcon={<ArrowForwardIcon />}
                        variant="outlined"
                      >
                        {"Read More"}
                      </Button>
                    }
                    isHighlighted={_selectedSystem === system.code}
                  />
                }
              </Grid>
            );
          })}
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

  const {
    title,
    description,
    type,
    question,
    locale,
    noResultItems,
    pimSystems
  } = data;
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
            />
          </SystemConfigurtorContext.Provider>
        ) : null}
      </Section>
      {state.result && (
        <SystemConfiguratorBlockResultSection
          {...state.result}
          pimSystems={pimSystems}
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
    pimSystems {
      code
      name
      shortDescription
      images {
        format
        assetType
        url
      }
    }
  }
`;

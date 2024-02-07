import { useIsClient } from "@bmi-digital/components/hooks";
import { useEffect, useMemo, useState } from "react";
import type { Training } from "@bmi/elasticsearch-types";
import { useConfig } from "../../../contexts/ConfigProvider";
import { queryElasticSearch } from "../../../utils/elasticSearch";
import type { ESTrainingDetails } from "../types";

const TRAINING_CODE_PARAM = "trainingCode";
const SESSION_ID_PARAM = "session";

export type UseRegistration = () => {
  training?: Training;
  loading: boolean;
};

const getTraining = async (
  trainingCode: string,
  sessionId: string,
  esIndexNameTrainings: string
): Promise<Training | undefined> => {
  try {
    const res: ESTrainingDetails = await queryElasticSearch(
      {
        size: 1,
        query: {
          bool: {
            must: [
              {
                match: {
                  "courseCode.keyword": trainingCode
                }
              },
              {
                match: {
                  sessionId
                }
              }
            ]
          }
        }
      },
      esIndexNameTrainings
    );
    return res?.hits?.hits?.[0]?._source;
  } catch (err) {
    console.error(err);
  }
};

export const useRegistration: UseRegistration = () => {
  const [training, setTraining] = useState<Training | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const { isClient } = useIsClient();
  const { esIndexNameTrainings } = useConfig();

  const { trainingCode, session } = useMemo(() => {
    const params = new URLSearchParams(isClient ? window.location.search : {});
    return {
      trainingCode: params.get(TRAINING_CODE_PARAM),
      session: params.get(SESSION_ID_PARAM)
    };
  }, [isClient]);

  useEffect(() => {
    if (!trainingCode || !session || !esIndexNameTrainings) {
      setLoading(false);
      return;
    }

    const setData = async () => {
      setLoading(true);
      const training = await getTraining(
        trainingCode,
        session,
        esIndexNameTrainings
      );
      setTraining(training);
      setLoading(false);
    };
    setData();
  }, [trainingCode, session]);

  return {
    training,
    loading
  };
};

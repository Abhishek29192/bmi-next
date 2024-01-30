import { useEffect, useMemo, useState } from "react";
import { useIsClient } from "@bmi-digital/components/hooks";
import type { Training } from "@bmi/elasticsearch-types";
import { useConfig } from "../../../contexts/ConfigProvider";
import { queryElasticSearch } from "../../../utils/elasticSearch";
import type { ESTrainingDetails } from "../types";

export const URL_PARAM_KEY = "trainingCode";

export type UseRegistration = () => {
  training?: Training;
  loading: boolean;
};

const getTraining = async (
  trainingCode: string,
  esIndexNameTrainings: string
): Promise<Training | undefined> => {
  if (!esIndexNameTrainings) {
    return;
  }

  try {
    const res: ESTrainingDetails = await queryElasticSearch(
      {
        size: 1,
        query: {
          match: {
            "code.keyword": trainingCode
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

  const trainingCode = useMemo(() => {
    const params = new URLSearchParams(isClient ? window.location.search : {});
    return params.get(URL_PARAM_KEY);
  }, [isClient]);

  useEffect(() => {
    if (!trainingCode) {
      return;
    }

    const setData = async () => {
      setLoading(true);
      const training = await getTraining(trainingCode, esIndexNameTrainings);
      setTraining(training);
      setLoading(false);
    };
    setData();
  }, [trainingCode]);

  return {
    training,
    loading
  };
};

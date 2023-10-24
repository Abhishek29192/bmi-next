import { useEffect, useMemo, useState } from "react";
import { Training } from "@bmi/elasticsearch-types";
import { QUERY_KEY } from "@bmi-digital/components";
import { useConfig } from "../../../contexts/ConfigProvider";
import { queryElasticSearch } from "../../../utils/elasticSearch";
import { EsResponse, EsCollapsedTraining, EsTrainingHit } from "../types";
import groupBy from "../../../utils/groupBy";
import { SHOW_MORE_LIMIT } from "../constants";

export type UseTrainings = () => {
  initialLoading: boolean;
  groupedTrainings: { [catalogueId: string]: Training[] };
  fetchPaginatedTrainings: (catalogueId: number, from: number) => Promise<void>;
  collapseCatalogueCourses: (catalogueId: number) => void;
  total: { [catalogueId: string]: number };
  searchQuery: string;
};

export const useTrainings: UseTrainings = () => {
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [total, setTotal] = useState<{ [catalogueId: string]: number }>({});
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { esIndexNameTrainings } = useConfig();

  const getSearchTrainings = async (searchQuery) => {
    if (!esIndexNameTrainings) {
      setInitialLoading(false);
      return;
    }
    try {
      const responseSearch = await queryElasticSearch(
        {
          query: {
            query_string: {
              query: `*${searchQuery}*`,
              fields: ["code", "name"]
            }
          },

          collapse: {
            field: "catalogueId",
            inner_hits: {
              name: "inner_hits",
              size: SHOW_MORE_LIMIT
            }
          }
        },
        esIndexNameTrainings
      );
      const receivedTrainings = responseSearch.hits.hits.flatMap((hit) => {
        const { hits } = hit.inner_hits.inner_hits.hits;
        return hits.map((training) => training._source);
      });

      const total = responseSearch.hits.hits.reduce((acc, hit) => {
        const catalogueId = hit._source.catalogueId;
        return {
          ...acc,
          [catalogueId]: hit.inner_hits.inner_hits.hits.total.value
        };
      }, {});

      setTotal(total);
      setTrainings(receivedTrainings);
      setInitialLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  const getTrainings = async () => {
    if (!esIndexNameTrainings) {
      setInitialLoading(false);
      return;
    }

    try {
      const response: EsResponse<EsCollapsedTraining> =
        await queryElasticSearch(
          {
            collapse: {
              field: "catalogueId",
              inner_hits: {
                name: "inner_hits",
                size: SHOW_MORE_LIMIT
              }
            }
          },
          esIndexNameTrainings
        );

      const receivedTrainings = response.hits.hits.flatMap((hit) => {
        const { hits } = hit.inner_hits.inner_hits.hits;
        return hits.map((training) => training._source);
      });

      const total = response.hits.hits.reduce((acc, hit) => {
        const catalogueId = hit._source.catalogueId;
        return {
          ...acc,
          [catalogueId]: hit.inner_hits.inner_hits.hits.total.value
        };
      }, {});

      setTotal(total);
      setTrainings(receivedTrainings);
      setInitialLoading(false);
    } catch (err) {
      setInitialLoading(false);
      console.error(err);
    }
  };

  const fetchPaginatedTrainings = async (catalogueId: number, from: number) => {
    if (!esIndexNameTrainings) {
      return;
    }

    try {
      if (searchQuery) {
        const res = await queryElasticSearch(
          {
            from,
            size: SHOW_MORE_LIMIT,
            query: {
              bool: {
                must: [
                  {
                    query_string: {
                      query: `*${searchQuery}*`,
                      fields: ["code", "name"]
                    }
                  },
                  {
                    match: {
                      catalogueId: catalogueId
                    }
                  }
                ]
              }
            }
          },
          esIndexNameTrainings
        );
        const receivedTrainings = res.hits.hits.map(
          (training) => training._source
        );
        setTrainings((prevTrainings) => [
          ...prevTrainings,
          ...receivedTrainings
        ]);
      } else {
        const res: EsResponse<EsTrainingHit> = await queryElasticSearch(
          {
            from,
            size: SHOW_MORE_LIMIT,
            query: {
              match: {
                catalogueId: catalogueId
              }
            }
          },
          esIndexNameTrainings
        );
        const receivedTrainings = res.hits.hits.map(
          (training) => training._source
        );
        setTrainings((prevTrainings) => [
          ...prevTrainings,
          ...receivedTrainings
        ]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const queryString = params.get(QUERY_KEY);
    setSearchQuery(queryString);

    if (searchQuery) {
      getSearchTrainings(searchQuery);
    } else {
      getTrainings();
    }
  }, [searchQuery]);

  const groupedTrainings = useMemo(
    () => groupBy(trainings, (training) => training.catalogueId.toString()),
    [trainings]
  );

  const collapseCatalogueCourses = (catalogueId: number) => {
    const newTrainings = trainings.reduce<Training[]>((acc, training) => {
      if (training.catalogueId !== catalogueId) {
        return [...acc, training];
      }

      const catalogueCourses = acc.filter(
        (course) => course.catalogueId === catalogueId
      );
      if (catalogueCourses.length === SHOW_MORE_LIMIT) {
        return acc;
      }

      return [...acc, training];
    }, []);

    setTrainings(newTrainings);
  };

  return {
    initialLoading,
    groupedTrainings,
    fetchPaginatedTrainings,
    collapseCatalogueCourses,
    total,
    searchQuery
  };
};

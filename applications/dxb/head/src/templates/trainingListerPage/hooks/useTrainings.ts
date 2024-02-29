import { Filter } from "@bmi-digital/components/filters";
import { useIsClient } from "@bmi-digital/components/hooks";
import { QUERY_KEY } from "@bmi-digital/components/search";
import { Training } from "@bmi/elasticsearch-types";
import queryString from "query-string";
import { useEffect, useMemo, useState } from "react";
import { useConfig } from "../../../contexts/ConfigProvider";
import {
  disableFiltersFromAggregations,
  queryElasticSearch
} from "../../../utils/elasticSearch";
import { updateFilterValue } from "../../../utils/filters";
import groupBy from "../../../utils/groupBy";
import { SHOW_MORE_LIMIT } from "../constants";
import {
  constructFiltersQuery,
  constructSearchQuery
} from "../helpers/constructEsQuery";
import { CollapsedTrainingResponse, PaginatedTrainingResponse } from "../types";

export type UseTrainings = (props: { defaultFilters: Filter[] }) => {
  initialLoading: boolean;
  groupedTrainings: { [catalogueId: string]: Training[] };
  fetchPaginatedTrainings: (catalogueId: string, from: number) => Promise<void>;
  collapseCatalogueCourses: (catalogueId: string) => void;
  total: { [catalogueId: string]: number };
  handleFiltersChange: (
    filterName: string,
    filterValue: string,
    checked: boolean
  ) => Promise<void>;
  handleResetFilters: () => Promise<void>;
  filters: Filter[];
  searchQuery: string;
};

export const useTrainings: UseTrainings = (props) => {
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [total, setTotal] = useState<{ [catalogueId: string]: number }>({});
  const { esIndexNameTrainings } = useConfig();
  const [filters, setFilters] = useState<Filter[]>(props.defaultFilters);
  const [currentTime] = useState<number>(new Date().getTime());

  const { isClient } = useIsClient();

  const params = useMemo(() => {
    return isClient ? queryString.parse(window.location.search, {}) : "";
  }, [isClient]);

  const searchQuery = useMemo(() => {
    const queryValue = params && params[QUERY_KEY.toString()];
    return typeof queryValue === "string" ? queryValue : "";
  }, [params]);

  const fetchPaginatedTrainings = async (catalogueId: string, from: number) => {
    if (!esIndexNameTrainings) {
      return;
    }

    try {
      const res: PaginatedTrainingResponse = await queryElasticSearch(
        {
          from,
          size: SHOW_MORE_LIMIT,
          query: {
            bool: {
              must: [
                {
                  match: {
                    "catalogueId.keyword": catalogueId
                  }
                },
                ...constructFiltersQuery(filters),
                constructSearchQuery(searchQuery),
                {
                  range: {
                    startDate: {
                      gt: currentTime
                    }
                  }
                }
              ]
            }
          },
          collapse: {
            field: "courseId"
          }
        },
        esIndexNameTrainings
      );
      const receivedTrainings = res.hits.hits.map(
        (training) => training._source
      );
      setTrainings((prevTrainings) => [...prevTrainings, ...receivedTrainings]);
    } catch (err) {
      console.error(err);
    }
  };

  const getTrainings = async (filters: Filter[] = props.defaultFilters) => {
    if (!esIndexNameTrainings) {
      setInitialLoading(false);
      return;
    }

    try {
      const response: CollapsedTrainingResponse = await queryElasticSearch(
        {
          query: {
            bool: {
              must: [
                ...constructFiltersQuery(filters),
                constructSearchQuery(searchQuery),
                {
                  range: {
                    startDate: {
                      gt: currentTime
                    }
                  }
                }
              ]
            }
          },
          collapse: {
            field: "catalogueId.keyword",
            inner_hits: {
              name: "inner_hits",
              size: SHOW_MORE_LIMIT,
              collapse: { field: "courseId" }
            }
          },
          aggs: {
            catalogueId: {
              terms: {
                size: "10",
                field: "catalogueId.keyword"
              },
              aggs: {
                uniqueItemsCount: {
                  cardinality: {
                    field: "courseId"
                  }
                }
              }
            },
            category: {
              terms: {
                size: "15",
                field: "category.keyword"
              }
            }
          }
        },
        esIndexNameTrainings
      );

      const receivedTrainings = response.hits.hits.flatMap((hit) => {
        const { hits } = hit.inner_hits.inner_hits.hits;
        return hits.map((training) => training._source);
      });

      const total = response.aggregations.catalogueId.buckets.reduce(
        (acc, bucket) => {
          const catalogueId = bucket.key;
          return {
            ...acc,
            [catalogueId]: bucket.uniqueItemsCount?.value
          };
        },
        {}
      );

      const updatedFilters = disableFiltersFromAggregations(
        filters,
        response.aggregations
      );

      setFilters(updatedFilters);

      setTotal(total);
      setTrainings(receivedTrainings);
      setInitialLoading(false);
    } catch (err) {
      setInitialLoading(false);
      console.error(err);
    }
  };

  useEffect(() => {
    getTrainings();
  }, [searchQuery]);

  const groupedTrainings = useMemo(
    () => groupBy(trainings, (training) => training.catalogueId.toString()),
    [trainings]
  );

  const collapseCatalogueCourses = (catalogueId: string) => {
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

  const handleFiltersChange = async (
    filterName: string,
    filterValue: string,
    checked: boolean
  ) => {
    const newFilters = updateFilterValue(
      filters,
      filterName,
      filterValue,
      checked
    );

    setFilters(newFilters);
    await getTrainings(newFilters);
  };

  const handleResetFilters = async () => {
    setFilters(props.defaultFilters);
    await getTrainings(props.defaultFilters);
  };

  return {
    initialLoading,
    groupedTrainings,
    fetchPaginatedTrainings,
    collapseCatalogueCourses,
    handleFiltersChange,
    handleResetFilters,
    total,
    filters,
    searchQuery: searchQuery
  };
};

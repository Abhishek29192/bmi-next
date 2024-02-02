import { createTraining } from "@bmi/elasticsearch-types";
import { waitFor } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";
import mockConsole from "jest-mock-console";
import React from "react";
import { Config, ConfigProvider } from "../../../../contexts/ConfigProvider";
import { queryElasticSearch } from "../../../../utils/elasticSearch";
import { useRegistration } from "../useRegistration";

const esIndexNameTrainings = "dxb-all-trainings_read";

const training = createTraining({
  sessionId: 65,
  courseCode: "IT_TEST_08"
});

const queryElasticsearchMock = jest.fn();
jest.mock("../../../../utils/elasticSearch", () => ({
  queryElasticSearch: (...args: Parameters<typeof queryElasticSearch>) =>
    queryElasticsearchMock(...args)
}));

const render = ({
  configOverride = { esIndexNameTrainings }
}: {
  configOverride?: Partial<Config>;
} = {}) => {
  const Wrapper = ({ children }: { children: JSX.Element }) => (
    <ConfigProvider configOverride={configOverride}>{children}</ConfigProvider>
  );

  return renderHook(() => useRegistration(), {
    wrapper: Wrapper
  });
};

const trainingResponse = {
  hits: {
    total: {
      value: 1,
      relation: "eq"
    },
    max_score: 3.871201,
    hits: [
      {
        _index: esIndexNameTrainings,
        _type: "_doc",
        _id: "295-24",
        _score: 3.871201,
        _source: training
      }
    ]
  }
};

afterEach(() => {
  jest.clearAllMocks();

  Object.defineProperty(window, "location", {
    value: {
      search: ""
    },
    writable: true
  });
});

beforeEach(() => {
  mockConsole();
});

describe("useRegistration", () => {
  it("pulls training on page mount", async () => {
    queryElasticsearchMock.mockResolvedValue(trainingResponse);
    Object.defineProperty(window, "location", {
      value: {
        search: `?trainingCode=${training.courseCode}&session=${training.sessionId}`
      },
      writable: true
    });
    const { result } = render();

    expect(queryElasticsearchMock).toHaveBeenCalledTimes(1);
    expect(queryElasticsearchMock).toHaveBeenCalledWith(
      {
        size: 1,
        query: {
          bool: {
            must: [
              {
                match: {
                  "courseCode.keyword": training.courseCode
                }
              },
              {
                match: {
                  sessionId: training.sessionId.toString()
                }
              }
            ]
          }
        }
      },
      esIndexNameTrainings
    );
    await waitFor(() =>
      expect(result.current).toEqual({ training, loading: false })
    );
  });

  it("should not call 'queryElasticsearchMock' if 'esIndexNameTrainings' does not exist", () => {
    Object.defineProperty(window, "location", {
      value: {
        search: `?trainingCode=${training.courseCode}&session=${training.sessionId}`
      },
      writable: true
    });

    const { result } = render({
      configOverride: { esIndexNameTrainings: undefined }
    });

    expect(queryElasticsearchMock).not.toHaveBeenCalled();
    expect(result.current).toEqual({ training: undefined, loading: false });
  });

  it("should not call 'queryElasticsearchMock' if trainingCode does not exist", () => {
    Object.defineProperty(window, "location", {
      value: {
        search: `?session=${training.sessionId}`
      },
      writable: true
    });
    const { result } = render();

    expect(queryElasticsearchMock).not.toHaveBeenCalled();
    expect(result.current).toEqual({ training: undefined, loading: false });
  });

  it("should not call 'queryElasticsearchMock' if session parameter does not exist", () => {
    Object.defineProperty(window, "location", {
      value: {
        search: `?trainingCode=${training.courseCode}`
      },
      writable: true
    });
    const { result } = render();

    expect(queryElasticsearchMock).not.toHaveBeenCalled();
    expect(result.current.training).toEqual(undefined);
    expect(result.current).toEqual({ training: undefined, loading: false });
  });

  it("works correctly if 'queryElasticSearch' throws an error", async () => {
    const error = new Error("Expected error");
    queryElasticsearchMock.mockRejectedValue(error);

    Object.defineProperty(window, "location", {
      value: {
        search: `?trainingCode=${training.courseCode}&session=${training.sessionId}`
      },
      writable: true
    });

    const { result } = render();
    expect(queryElasticsearchMock).toHaveBeenCalledWith(
      {
        size: 1,
        query: {
          bool: {
            must: [
              {
                match: {
                  "courseCode.keyword": training.courseCode
                }
              },
              {
                match: {
                  sessionId: training.sessionId.toString()
                }
              }
            ]
          }
        }
      },
      esIndexNameTrainings
    );
    await waitFor(() =>
      expect(result.current).toEqual({ training: undefined, loading: false })
    );
    expect(console.error).toHaveBeenCalledWith(error);
  });
});

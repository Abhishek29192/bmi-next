import React from "react";
import { renderHook } from "@testing-library/react-hooks";
import { waitFor } from "@testing-library/react";
import { createTraining } from "@bmi/elasticsearch-types";
import mockConsole from "jest-mock-console";
import { useRegistration } from "../useRegistration";
import { Config, ConfigProvider } from "../../../../contexts/ConfigProvider";
import { queryElasticSearch } from "../../../../utils/elasticSearch";

const esIndexNameTrainings = "dxb-all-trainings_read";

const training = createTraining({
  id: "295-24",
  courseId: 295,
  name: "Italian Sales Training Webinar",
  code: "IT_TEST_08",
  slug: "italian-sales-training-webinar",
  courseType: "classroom",
  imgUrl:
    "https://cdn5.dcbstatic.com/files/b/m/bmisandbox_docebosaas_com/assets/courselogo/original/null-2021-07-27-11-14-06.jpeg",
  category: "Other",
  catalogueId: "24",
  catalogueName: "IT Custom Catalogue",
  catalogueDescription: "",
  onSale: false
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
        search: "?trainingCode=IT_TEST_08"
      },
      writable: true
    });
    const { result } = render();

    expect(queryElasticsearchMock).toHaveBeenCalledTimes(1);
    expect(queryElasticsearchMock).toHaveBeenCalledWith(
      {
        size: 1,
        query: {
          match: {
            "code.keyword": "IT_TEST_08"
          }
        }
      },
      esIndexNameTrainings
    );
    await waitFor(() =>
      expect(result.current).toEqual({ training, loading: false })
    );
  });

  it("should not call 'queryElasticsearchMock' if 'esIndexNameTrainings' does not exist", async () => {
    Object.defineProperty(window, "location", {
      value: {
        search: "?trainingCode=IT_TEST_08"
      },
      writable: true
    });

    const { result } = render({
      configOverride: { esIndexNameTrainings: undefined }
    });

    expect(queryElasticsearchMock).not.toHaveBeenCalled();
    await waitFor(() =>
      expect(result.current).toEqual({ training: undefined, loading: false })
    );
  });

  it("should not call 'queryElasticsearchMock' if trainingCode does not exist", async () => {
    Object.defineProperty(window, "location", {
      value: {
        search: ""
      },
      writable: true
    });
    const { result } = render();

    expect(queryElasticsearchMock).not.toHaveBeenCalled();
    expect(result.current.training).toEqual(undefined);
  });

  it("works correctly if 'queryElasticSearch' throws an error", async () => {
    const error = new Error("Expected error");
    queryElasticsearchMock.mockRejectedValue(error);

    Object.defineProperty(window, "location", {
      value: {
        search: "?trainingCode=IT_TEST_08"
      },
      writable: true
    });

    const { result } = render();
    expect(queryElasticsearchMock).toHaveBeenCalledWith(
      {
        size: 1,
        query: {
          match: {
            "code.keyword": "IT_TEST_08"
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

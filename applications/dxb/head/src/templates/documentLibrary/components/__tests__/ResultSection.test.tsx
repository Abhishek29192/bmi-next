import { fireEvent, render, waitFor } from "@testing-library/react";
import React from "react";
import { createPimProductDocument } from "@bmi/elasticsearch-types";
import * as documentResultsFooter from "../../../../components/DocumentResultsFooter";
import ResultSection, { Props as ResultSectionProps } from "../ResultSection";
import createAssetType from "../../../../__tests__/helpers/AssetTypeHelper";

const executeRecaptchaSpy = jest.fn().mockResolvedValue("RECAPTCHA");
jest.mock("react-google-recaptcha-v3", () => {
  const originalModule = jest.requireActual("react-google-recaptcha-v3");
  return {
    ...originalModule,
    useGoogleReCaptcha: () => ({
      executeRecaptcha: executeRecaptchaSpy
    })
  };
});

beforeEach(() => {
  jest.clearAllMocks();
  jest.restoreAllMocks();
  jest.resetModules();
});

describe("ResultSection", () => {
  const handlePageChange = jest.fn();
  const pimDocument = createPimProductDocument({
    id: `pim-doc-id`,
    url: `pim-doc-url`,
    title: "documentTitle"
  });
  const assetType = createAssetType();
  const props: ResultSectionProps = {
    results: [pimDocument],
    assetTypes: [assetType],
    format: "simpleTable",
    page: 1,
    pageCount: 2,
    handlePageChange
  };

  it("render correctly", () => {
    const { container } = render(<ResultSection {...props} />);

    expect(container.querySelector(".DocumentSimpleTableResults")).toBeTruthy();
    expect(
      container.querySelectorAll(".DocumentSimpleTableResults .row").length
    ).toBe(1);
    expect(container.querySelector(".results")).toBeTruthy();
    expect(container.querySelector(".DocumentResultsFooter")).toBeTruthy();
  });

  it("does not trigger handleDownloadClick if format is set to cards", async () => {
    const handleDownloadClickSpy = jest.spyOn(
      documentResultsFooter,
      "handleDownloadClick"
    );
    const { getByText } = render(<ResultSection {...props} />);

    const downloadButton = getByText("MC: downloadList.download (0)");
    fireEvent.click(downloadButton);
    await waitFor(() => {
      expect(executeRecaptchaSpy).toHaveBeenCalledTimes(1);
      expect(handleDownloadClickSpy).toHaveBeenCalledTimes(0);
    });
  });

  it("not render downloadList when format is set to technicalTable", async () => {
    const { queryByText } = render(
      <ResultSection {...{ ...props, format: "technicalTable" }} />
    );

    expect(queryByText("MC: downloadList.clear")).toBeFalsy();
    expect(queryByText("MC: downloadList.download (0)")).toBeFalsy();
  });
});

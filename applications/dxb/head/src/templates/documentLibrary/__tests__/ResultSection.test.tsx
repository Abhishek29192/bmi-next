import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import ResultSection, {
  Props as ResultSectionProps
} from "../components/ResultSection";
import createPimDocument from "../../../__tests__/PimDocumentHelper";
import createProduct from "../../../__tests__/PimDocumentProductHelper";
import createCategory from "../../../__tests__/CategoryHelper";
import createClassification from "../../../__tests__/ClassificationHelper";
import { PIMDocumentData } from "../../../components/types/PIMDocumentBase";
import * as documentResultsFooter from "../../../components/DocumentResultsFooter";

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
  const pimDocument: PIMDocumentData = createPimDocument({
    id: `pim-doc-id`,
    url: `pim-doc-url`,
    title: "documentTitle",
    product: createProduct({
      categories: [createCategory({ categoryType: "Brand" })],
      classifications: [createClassification()]
    })
  });
  const props: ResultSectionProps = {
    results: [pimDocument],
    format: "simpleTable",
    page: 1,
    pageCount: 2,
    handlePageChange
  };

  it("render correctly", () => {
    const { container } = render(<ResultSection {...props} />);

    expect(container.firstChild).toMatchSnapshot();
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
    const { container, queryByText } = render(
      <ResultSection {...{ ...props, format: "technicalTable" }} />
    );

    expect(container).toMatchSnapshot();
    expect(queryByText("MC: downloadList.clear")).toBeFalsy();
    expect(queryByText("MC: downloadList.download (0)")).toBeFalsy();
  });
});

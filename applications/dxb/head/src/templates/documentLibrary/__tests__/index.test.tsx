/* eslint-disable prefer-spread */
import React from "react";
import { fireEvent, waitFor } from "@testing-library/react";
import { renderWithRouter } from "../../../test/renderWithRouter";
import DocumentLibraryPage, { Data as DocumentLibraryPageData } from "../";
import { createMockSiteData } from "../../../test/mockSiteData";
import { Data as SiteData } from "../../../components/Site";
import { PIMDocumentData } from "../../../components/types/PIMDocumentBase";
import createPimDocument from "../../../__tests__/PimDocumentHelper";
import createProduct from "../../../__tests__/PimDocumentProductHelper";
import createCategory from "../../../__tests__/CategoryHelper";
import createClassification from "../../../__tests__/ClassificationHelper";
import * as devLog from "../../../utils/devLog";
import * as filterUtils from "../../../utils/filters";
import * as documentResultsFooter from "../../../components/DocumentResultsFooter";
import { ContentfulVideoData } from "../../../components/Video";

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

describe("Document Library page", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  const videoData: ContentfulVideoData = {
    __typename: "ContentfulVideo",
    title: "BMI Group - We see further",
    label: "BMI Group VIDEO LABEL",
    subtitle:
      "BMI Group - The beginning of a new era in the roofing and waterproofing industry.",
    youtubeId: "TDNEwZbm_Nk",
    previewMedia: null,
    videoRatio: { width: 17776, height: 9999 }
  };

  const createData = (): {
    contentfulDocumentLibraryPage: DocumentLibraryPageData;
    contentfulSite: SiteData;
  } => ({
    contentfulDocumentLibraryPage: {
      __typename: "ContentfulDocumentLibraryPage",
      id: "id",
      title: "title",
      subtitle: null,
      brandLogo: null,
      slug: "slug",
      date: null,
      tags: null,
      // TODO: Move Video as option of Media.
      featuredMedia: null,
      featuredVideo: videoData,
      inputBanner: null,
      seo: null,
      path: "/path",
      description: null,
      allowFilterBy: null,
      source: "PIM",
      resultsType: "Simple",
      documents: [],
      breadcrumbs: [
        {
          id: "abc123",
          label: "documentlibrary",
          slug: "document-library"
        }
      ],
      categoryCodes: ["categoryCodes"],
      breadcrumbTitle: "breadcrumbTitle"
    },
    contentfulSite: createMockSiteData()
  });
  const pageContext = {
    pageId: null,
    siteId: null,
    categoryCode: null,
    pimClassificationCatalogueNamespace: null,
    variantCodeToPathMap: null
  };
  const pimDocument: PIMDocumentData = createPimDocument({
    id: `pim-doc-id`,
    url: `pim-doc-url`,
    title: "documentTitle",
    product: createProduct({
      categories: [createCategory({ categoryType: "Brand" })],
      classifications: [createClassification()]
    })
  });

  it("renders correctly", () => {
    const { container, getByTestId, getByText } = renderWithRouter(
      <DocumentLibraryPage data={createData()} pageContext={pageContext} />
    );
    expect(container.querySelectorAll("header").length).toBe(1);
    expect(container.querySelectorAll(".Footer").length).toBe(1);
    expect(getByTestId("brand-colors-provider")).toBeTruthy();
    expect(container.querySelector(".Hero")).toBeTruthy();
    expect(container.querySelector(".Hero .Breadcrumbs")).toBeTruthy();
    expect(
      container.querySelector(".Section--white .Filters .scroll-bar")
    ).toBeTruthy();
    expect(getByText("MC: documentLibrary.filters.title")).toBeTruthy();
    expect(getByText("MC: documentLibrary.filters.clearAll")).toBeTruthy();
    expect(getByText("MC: documentLibrary.noResults")).toBeTruthy();
    expect(
      container.querySelector(".Section--alabaster.Section--slim")
    ).toBeTruthy();
    expect(
      container.querySelector(".Section--alabaster.Section--slim .Breadcrumbs")
    ).toBeTruthy();
  });

  it("renders desription correctly", () => {
    const raw = {
      nodeType: "document",
      data: {},
      content: [
        {
          nodeType: "paragraph",
          content: [
            {
              nodeType: "text",
              value: "this is a test paragraph",
              marks: [],
              data: {}
            }
          ],
          data: {}
        }
      ]
    };

    const richText = {
      raw: JSON.stringify(raw),
      references: [
        {
          __typename: "NonType",
          contentful_id: "3tcysaa3PGMlm42U4WnlmK"
        }
      ]
    };
    const data = createData();
    data.contentfulDocumentLibraryPage.description = richText;
    const { getByText } = renderWithRouter(
      <DocumentLibraryPage data={data} pageContext={pageContext} />
    );

    expect(getByText("this is a test paragraph")).toBeTruthy();
  });

  it("render DocumentResults and DocumentResultsFooter correctly", () => {
    const data = createData();
    data.contentfulDocumentLibraryPage.documents = [pimDocument];
    const { container } = renderWithRouter(
      <DocumentLibraryPage data={data} pageContext={pageContext} />
    );

    expect(container.querySelector(".DocumentSimpleTableResults")).toBeTruthy();
    expect(
      container.querySelectorAll(".DocumentSimpleTableResults .row").length
    ).toBe(1);
    expect(container.querySelector(".results")).toBeTruthy();
    expect(container.querySelector(".DocumentResultsFooter")).toBeTruthy();
  });

  it("filter documents correctly", async () => {
    const data = createData();
    const pimDocument1 = createPimDocument({
      id: `pim-doc-id`,
      url: `pim-doc-url`,
      product: createProduct({
        categories: [createCategory({ categoryType: "Brand" })]
      })
    });
    const pimDocument2 = createPimDocument({
      id: `pim-doc-id1`,
      title: "documentTitle2",
      product: createProduct({
        code: "product-code-2",
        categories: [
          createCategory({
            categoryType: "ProductFamily",
            name: "category-name1",
            code: "category-code2"
          })
        ]
      })
    });
    data.contentfulDocumentLibraryPage.documents = [pimDocument1, pimDocument2];
    const { container } = renderWithRouter(
      <DocumentLibraryPage data={data} pageContext={pageContext} />
    );

    expect(
      container.querySelectorAll(".DocumentSimpleTableResults .row").length
    ).toBe(2);
    const filterbutton = container.querySelector(".Filters .list input");

    fireEvent.click(filterbutton);
    await waitFor(() =>
      expect(
        container.querySelectorAll(".DocumentSimpleTableResults .row").length
      ).toBe(1)
    );
  });

  it("clear filter correctly when click the checked filter", async () => {
    const data = createData();
    const pimDocument1 = createPimDocument({
      id: `pim-doc-id`,
      url: `pim-doc-url`,
      product: createProduct({
        categories: [createCategory({ categoryType: "Brand" })],
        classifications: [createClassification()]
      })
    });
    const pimDocument2 = createPimDocument({
      id: `pim-doc-id2`,
      title: `documentTitle2`,
      product: createProduct({
        categories: [
          createCategory({
            categoryType: "Brand",
            name: "dif-category-name1",
            code: "dif-category-code1"
          })
        ]
      })
    });
    data.contentfulDocumentLibraryPage.documents = [pimDocument1, pimDocument2];
    const { container } = renderWithRouter(
      <DocumentLibraryPage data={data} pageContext={pageContext} />
    );

    expect(
      container.querySelectorAll(".DocumentSimpleTableResults .row").length
    ).toBe(2);

    const filterbutton = container.querySelector(".Filters .list input");
    fireEvent.click(filterbutton);
    await waitFor(() =>
      expect(
        container.querySelectorAll(".DocumentSimpleTableResults .row").length
      ).toBe(1)
    );

    const filterbutton2 = container.querySelector(".Filters .list input");
    fireEvent.click(filterbutton2);
    await waitFor(() =>
      expect(
        container.querySelectorAll(".DocumentSimpleTableResults .row").length
      ).toBe(2)
    );
  }, 10000);

  it("call devLog when calling fakesearch while isLoading", async () => {
    const data = createData();
    data.contentfulDocumentLibraryPage.documents = Array.apply(
      null,
      Array(1)
    ).map((_, id) => ({
      ...pimDocument,
      id: `document${id}`,
      title: `documentTitle${id}`
    }));
    const devLogSpy = jest.spyOn(devLog, "devLog");
    const { container } = renderWithRouter(
      <DocumentLibraryPage data={data} pageContext={pageContext} />
    );
    const filterbutton = container.querySelectorAll(".Filters .list input")[0];
    const clearFilterButton = container.querySelector(".Filters button");
    let promise;
    jest.spyOn(filterUtils, "filterDocuments").mockImplementationOnce(
      () =>
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        new Promise((r) => (promise = r))
    );
    fireEvent.click(filterbutton);
    await new Promise((r) => setTimeout(r, 100));
    fireEvent.click(clearFilterButton);
    expect(devLogSpy).toHaveBeenCalledTimes(1);
    promise(data.contentfulDocumentLibraryPage.documents);
  });

  it("show the correct documents after clicking the pagination", () => {
    const data = createData();
    data.contentfulDocumentLibraryPage.documents = Array.apply(
      null,
      Array(25)
    ).map((_, id) => ({
      ...pimDocument,
      id: `document${id}`,
      title: `documentTitle${id}`
    }));
    const { container, getByLabelText, getByText } = renderWithRouter(
      <DocumentLibraryPage data={data} pageContext={pageContext} />
    );

    expect(
      container.querySelectorAll(".DocumentSimpleTableResults .row").length
    ).toBe(24);
    const nextPageButton = getByLabelText("Go to next page");

    fireEvent.click(nextPageButton);
    expect(
      container.querySelectorAll(".DocumentSimpleTableResults .row").length
    ).toBe(1);
    expect(getByText("documentTitle24")).toBeTruthy();
  });

  it("render downloadList info block after selected at least 1 document", () => {
    const data = createData();
    data.contentfulDocumentLibraryPage.documents = Array.apply(
      null,
      Array(2)
    ).map((_, id) => ({
      ...pimDocument,
      id: `document${id}`,
      title: `documentTitle${id}`
    }));
    const { queryByText, getByText, getByLabelText } = renderWithRouter(
      <DocumentLibraryPage data={data} pageContext={pageContext} />
    );
    const checkbox = getByLabelText(
      "MC: documentLibrary.download documentTitle1"
    );
    expect(queryByText("MC: downloadList.info.title")).toBeFalsy();
    expect(queryByText("MC: downloadList.info.message")).toBeFalsy();

    fireEvent.click(checkbox);
    expect(getByText("MC: downloadList.info.title")).toBeTruthy();
    expect(getByText("MC: downloadList.info.message")).toBeTruthy();
  });

  it("update count after clicking the checkbox", async () => {
    const data = createData();
    data.contentfulDocumentLibraryPage.documents = Array.apply(
      null,
      Array(2)
    ).map((object, id) => ({
      ...pimDocument,
      id: `document${id}`,
      title: `documentTitle${id}`
    }));
    const handleDownloadClickSpy = jest.spyOn(
      documentResultsFooter,
      "handleDownloadClick"
    );
    const { getByLabelText, getByText } = renderWithRouter(
      <DocumentLibraryPage data={data} pageContext={pageContext} />
    );
    const checkbox = getByLabelText(
      "MC: documentLibrary.download documentTitle0"
    );
    const checkbox2 = getByLabelText(
      "MC: documentLibrary.download documentTitle1"
    );

    fireEvent.click(checkbox);
    fireEvent.click(checkbox2);
    const downloadButton = getByText("MC: downloadList.download (2)");
    fireEvent.click(downloadButton);
    await waitFor(() => {
      expect(executeRecaptchaSpy).toHaveBeenCalledTimes(1);
      expect(handleDownloadClickSpy).toHaveBeenCalledTimes(1);
    });
  });

  it("update page count correctly after applied filter", async () => {
    const data = createData();
    data.contentfulDocumentLibraryPage.documents = [
      pimDocument,
      ...Array.apply(null, Array(24)).map((_, id) => ({
        ...pimDocument,
        id: `document${id}`,
        title: `documentTitle${id}`
      }))
    ];
    jest.spyOn(filterUtils, "filterDocuments").mockReturnValue([]);
    const { container } = renderWithRouter(
      <DocumentLibraryPage data={data} pageContext={pageContext} />
    );

    expect(
      container.querySelectorAll(".DocumentResultsFooter .pagination ul li")
        .length
    ).toBe(4);
    const filterbutton = container.querySelector(".Filters .list input");
    fireEvent.click(filterbutton);
    await waitFor(() => {
      expect(
        container.querySelectorAll(".DocumentResultsFooter .pagination ul li")
          .length
      ).toBe(0);
    });
  }, 10000);

  it("should show tooltip when reach max limit", async () => {
    const data = createData();
    data.contentfulDocumentLibraryPage.documents = Array.apply(
      null,
      Array(2)
    ).map((object, id) => ({
      ...pimDocument,
      id: `document${id}`,
      title: `documentTitle${id}`,
      fileSize: 104857600
    }));
    process.env.GATSBY_DOCUMENT_DOWNLOAD_MAX_LIMIT = "200";
    const { container, getByLabelText } = renderWithRouter(
      <DocumentLibraryPage data={data} pageContext={pageContext} />
    );
    const checkbox = getByLabelText(
      "MC: documentLibrary.download documentTitle0"
    );
    const checkbox2 = getByLabelText(
      "MC: documentLibrary.download documentTitle1"
    );

    fireEvent.click(checkbox);
    fireEvent.mouseOver(checkbox2);
    expect(
      container.querySelector("[title='MC: documents.download.maxReached']")
    ).toBeFalsy();
    fireEvent.click(checkbox2);
    fireEvent.mouseOver(checkbox2);
    expect(
      container.querySelector("[title='MC: documents.download.maxReached']")
    ).toBeTruthy();
  });
});

/* eslint-disable prefer-spread */
import { fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import DocumentLibraryPage, { Data as DocumentLibraryPageData } from "../";
// import * as devLog from "../../../utils/devLog";
// import * as filterUtils from "../../../utils/filters";
import * as documentResultsFooter from "../../../components/DocumentResultsFooter";
import { Data as SiteData } from "../../../components/Site";
import { ContentfulVideoData } from "../../../components/Video";
import { ConfigProvider } from "../../../contexts/ConfigProvider";
import { createMockSiteData } from "../../../test/mockSiteData";
import { renderWithRouter } from "../../../test/renderWithRouter";
import createPimDocument from "../../../__tests__/helpers/PimDocumentHelper";

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
    videoUrl: "https://www.youtube.com/watch?v=TDNEwZbm_Nk",
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
      signupBlock: null,
      seo: null,
      path: "/path",
      description: null,
      allowFilterBy: null,
      source: "PIM",
      resultsType: "Simple",
      documentsWithFilters: { filters: [], documents: [] },
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
    variantCodeToPathMap: null
  };
  const pimDocument = createPimDocument({
    id: `pim-doc-id`,
    url: `pim-doc-url`,
    title: "documentTitle"
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
    data.contentfulDocumentLibraryPage.documentsWithFilters = {
      filters: [],
      documents: [pimDocument]
    };
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

  // TODO: investigate and fix later!

  // it("filter documents correctly", async () => {
  //   const data = createData();
  //   const pimDocument1 = createPimDocument({
  //     id: `pim-doc-id`,
  //     url: `pim-doc-url`,
  //     productCategories: [
  //       {
  //         parentCategoryCode: "parent-category-1",
  //         categoryType: "Category",
  //         code: "category-1",
  //         name: "category-1",
  //         image: null
  //       }
  //     ]
  //   });
  //   const pimDocument2 = createPimDocument({
  //     id: `pim-doc-id1`,
  //     title: "documentTitle2",
  //     productCategories: [
  //       {
  //         parentCategoryCode: "parent-category-1",
  //         categoryType: "Category",
  //         code: "category-1",
  //         name: "category-1",
  //         image: null
  //       }
  //     ]
  //   });
  //   data.contentfulDocumentLibraryPage.documentsWithFilters = {
  //     filters: [
  //       {
  //         filterCode: "filter-code",
  //         label: "filter-1",
  //         name: "parent-category-2",
  //         options: [
  //           { label: "option-1", value: "option-1-value" },
  //           { label: "option-2", value: "option-2-value" }
  //         ],
  //         value: ["option-1-value"]
  //       }
  //     ],
  //     documents: [pimDocument1, pimDocument2]
  //   };
  //   const { container } = renderWithRouter(
  //     <DocumentLibraryPage data={data} pageContext={pageContext} />
  //   );

  //   expect(
  //     container.querySelectorAll(".DocumentSimpleTableResults .row").length
  //   ).toBe(2);
  //   const filterbutton = container.querySelector(".Filters .list input");

  //   fireEvent.click(filterbutton);
  //   await waitFor(() =>
  //     expect(
  //       container.querySelectorAll(".DocumentSimpleTableResults .row").length
  //     ).toBe(1)
  //   );
  // }, 10000);

  // it("clear filter correctly when click the checked filter", async () => {
  //   const data = createData();
  //   const pimDocument1 = createPimDocument({
  //     id: `pim-doc-id`,
  //     url: `pim-doc-url`,
  //     productCategories: [
  //       {
  //         parentCategoryCode: "PITCHEDROOF_NO",
  //         code: "CONCRETE_NO",
  //         categoryType: "Category",
  //         image: null,
  //         name: "skaratak"
  //       }
  //     ]
  //   });
  //   const pimDocument2 = createPimDocument({
  //     id: `pim-doc-id2`,
  //     title: `documentTitle2`,
  //     productCategories: [
  //       {
  //         parentCategoryCode: "parent-category-3",
  //         code: "option-2-value",
  //         categoryType: "Category",
  //         image: null,
  //         name: "category-name-2"
  //       }
  //     ]
  //   });
  //   data.contentfulDocumentLibraryPage.documentsWithFilters = {
  //     filters: [
  //       {
  //         filterCode: "PITCHEDROOF_NO",
  //         label: "skaratak",
  //         name: "PITCHEDROOF_NO",
  //         options: [
  //           { label: "Betongtakstein", value: "CONCRETE_NO" },
  //           { label: "Festemateriell", value: "FIXING_PITCHEDROOF_NO" },
  //           { label: "Tegltakstein", value: "CLAY_NO" }
  //         ],
  //         value: ["CONCRETE_NO"]
  //       }
  //     ],
  //     documents: [pimDocument1, pimDocument2]
  //   };
  //   const { container } = renderWithRouter(
  //     <DocumentLibraryPage data={data} pageContext={pageContext} />
  //   );

  //   expect(
  //     container.querySelectorAll(".DocumentSimpleTableResults .row").length
  //   ).toBe(2);

  //   const filterbutton = container.querySelector(".Filters .list input");
  //   fireEvent.click(filterbutton);
  //   await waitFor(() =>
  //     expect(
  //       container.querySelectorAll(".DocumentSimpleTableResults .row").length
  //     ).toBe(1)
  //   );

  //   const filterbutton2 = container.querySelector(".Filters .list input");
  //   fireEvent.click(filterbutton2);
  //   await waitFor(() =>
  //     expect(
  //       container.querySelectorAll(".DocumentSimpleTableResults .row").length
  //     ).toBe(2)
  //   );
  // }, 10000);

  // it("call devLog when calling fakesearch while isLoading", async () => {
  //   const data = createData();
  //   data.contentfulDocumentLibraryPage.documentsWithFilters = {
  //     filters: [],
  //     documents: [pimDocument]
  //   };
  //   data.contentfulDocumentLibraryPage.documentsWithFilters.documents =
  //     Array.apply(null, Array(1)).map((_, id) => ({
  //       ...pimDocument,
  //       id: `document${id}`,
  //       title: `documentTitle${id}`
  //     }));
  //   const devLogSpy = jest.spyOn(devLog, "devLog");
  //   const { container } = renderWithRouter(
  //     <DocumentLibraryPage data={data} pageContext={pageContext} />
  //   );
  //   const filterbutton = container.querySelectorAll(".Filters .list input")[0];
  //   const clearFilterButton = container.querySelector(".Filters button");
  //   let promise;
  //   jest.spyOn(filterUtils, "filterDocuments").mockImplementationOnce(
  //     () =>
  //       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //       //@ts-ignore
  //       new Promise((r) => (promise = r))
  //   );
  //   fireEvent.click(filterbutton);
  //   await new Promise((r) => setTimeout(r, 100));
  //   fireEvent.click(clearFilterButton);
  //   expect(devLogSpy).toHaveBeenCalledTimes(1);
  //   promise(data.contentfulDocumentLibraryPage.documents);
  // });

  it("show the correct documents after clicking the pagination", () => {
    const data = createData();
    data.contentfulDocumentLibraryPage.documentsWithFilters = {
      filters: [],
      documents: [pimDocument]
    };
    data.contentfulDocumentLibraryPage.documentsWithFilters.documents =
      Array.apply(null, Array(25)).map((_, id) => ({
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
    data.contentfulDocumentLibraryPage.documentsWithFilters = {
      filters: [],
      documents: [pimDocument]
    };
    data.contentfulDocumentLibraryPage.documentsWithFilters.documents =
      Array.apply(null, Array(2)).map((_, id) => ({
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
    data.contentfulDocumentLibraryPage.documentsWithFilters = {
      filters: [],
      documents: [pimDocument]
    };
    data.contentfulDocumentLibraryPage.documentsWithFilters.documents =
      Array.apply(null, Array(2)).map((object, id) => ({
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

  it("should show tooltip when reach max limit", async () => {
    const data = createData();
    data.contentfulDocumentLibraryPage.documentsWithFilters = {
      filters: [],
      documents: [pimDocument]
    };
    data.contentfulDocumentLibraryPage.documentsWithFilters.documents =
      Array.apply(null, Array(2)).map((object, id) => ({
        ...pimDocument,
        id: `document${id}`,
        title: `documentTitle${id}`,
        fileSize: 104857600
      }));
    const { container, getByLabelText } = renderWithRouter(
      <ConfigProvider configObject={{ documentDownloadMaxLimit: 200 }}>
        <DocumentLibraryPage data={data} pageContext={pageContext} />
      </ConfigProvider>
    );
    const checkbox = getByLabelText(
      "MC: documentLibrary.download documentTitle0"
    );
    const checkbox2 = getByLabelText(
      "MC: documentLibrary.download documentTitle1"
    );

    fireEvent.click(checkbox);
    fireEvent.mouseOver(checkbox2);
    const title = container.querySelector(
      "[title='MC: documents.download.maxReached']"
    );
    expect(title).toBeFalsy();
    fireEvent.click(checkbox2);
    fireEvent.mouseOver(checkbox2);
    expect(
      container.querySelector("[title='MC: documents.download.maxReached']")
    ).toBeTruthy();
  });

  // it("update page count correctly after applied filter", async () => {
  //   const data = createData();
  //   data.contentfulDocumentLibraryPage.documentsWithFilters = {
  //     filters: [],
  //     documents: [pimDocument]
  //   };
  //   data.contentfulDocumentLibraryPage.documentsWithFilters.documents = [
  //     pimDocument,
  //     ...Array.apply(null, Array(24)).map((_, id) => ({
  //       ...pimDocument,
  //       id: `document${id}`,
  //       title: `documentTitle${id}`
  //     }))
  //   ];
  //   jest.spyOn(filterUtils, "filterDocuments").mockReturnValue([]);
  //   const { container } = renderWithRouter(
  //     <DocumentLibraryPage data={data} pageContext={pageContext} />
  //   );

  //   expect(
  //     container.querySelectorAll(".DocumentResultsFooter .pagination ul li")
  //       .length
  //   ).toBe(4);
  //   const filterbutton = container.querySelector(".Filters .list input");
  //   fireEvent.click(filterbutton);
  //   await waitFor(() => {
  //     expect(
  //       container.querySelectorAll(".DocumentResultsFooter .pagination ul li")
  //         .length
  //     ).toBe(0);
  //   });
  // }, 10000);
});

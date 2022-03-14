import { ThemeProvider } from "@bmi/components";
import { fireEvent, render } from "@testing-library/react";
import React from "react";
import { TrainingSidePanel } from "..";
import { generateTrainingCourseCatalogues } from "../../../../lib/tests/factories/training";
import I18nProvider from "../../../../lib/tests/fixtures/i18n";

describe("TrainingSidePanel component", () => {
  const courseCatalog = generateTrainingCourseCatalogues().nodes;

  it("renders correctly", () => {
    const { container } = render(
      <ThemeProvider>
        <I18nProvider>
          <TrainingSidePanel courseCatalog={courseCatalog} />
        </I18nProvider>
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });
  it("renders correctly when no courseCatalog is passed", () => {
    const { container } = render(
      <ThemeProvider>
        <I18nProvider>
          <TrainingSidePanel courseCatalog={[]} />
        </I18nProvider>
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });
  it("renders correctly when no technology is passed", () => {
    const courseCatalog = [
      {
        course: {
          name: "Flat Course",
          technology: null,
          courseEnrollments: {
            nodes: []
          }
        }
      }
    ];

    const { container } = render(
      <ThemeProvider>
        <I18nProvider>
          <TrainingSidePanel courseCatalog={courseCatalog} />
        </I18nProvider>
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });
  it("run filter correctly", () => {
    const filterChangeSpy = jest.fn();

    const { container, getAllByTestId } = render(
      <ThemeProvider>
        <I18nProvider>
          <TrainingSidePanel
            courseCatalog={courseCatalog}
            onFilterChange={filterChangeSpy}
          />
        </I18nProvider>
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
    expect(getAllByTestId("filterResult").length).toBe(3);
    const filterButton = container.querySelectorAll(
      ".filterButton [class*=Chip-root]"
    );

    fireEvent.click(filterButton[1]);
    expect(filterChangeSpy).toHaveBeenCalledTimes(1);
    expect(getAllByTestId("filterResult").length).toBe(1);
  });
  it("run search correctly", () => {
    const { container, getByLabelText, getAllByTestId } = render(
      <ThemeProvider>
        <I18nProvider>
          <TrainingSidePanel courseCatalog={courseCatalog} />
        </I18nProvider>
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
    expect(getAllByTestId("filterResult").length).toBe(3);
    const searchButton = getByLabelText("search.inputLabel");
    const filterInput = container.querySelector("#filter");

    fireEvent.change(filterInput, { target: { value: "Pitch" } });
    fireEvent.click(searchButton);
    expect(getAllByTestId("filterResult").length).toBe(1);
  });
  it("run onCourseSelected correctly when select course", () => {
    const onCourseSelected = jest.fn();
    const { container, getByText } = render(
      <ThemeProvider>
        <I18nProvider>
          <TrainingSidePanel
            courseCatalog={courseCatalog}
            onCourseSelected={onCourseSelected}
          />
        </I18nProvider>
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();

    fireEvent.click(getByText("Pitch Course"));
    expect(onCourseSelected).toHaveBeenCalledWith(2);
  });
  it("render no status text when status is missing", () => {
    const courseCatalog = [
      {
        course: {
          name: "Pitch Course",
          technology: "PITCH",
          courseId: 4,
          courseEnrollments: {
            nodes: [
              {
                id: 1,
                courseId: 2,
                url: ""
              }
            ]
          }
        }
      }
    ];
    const { container, getByLabelText } = render(
      <ThemeProvider>
        <I18nProvider>
          <TrainingSidePanel courseCatalog={courseCatalog} />
        </I18nProvider>
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
    const searchButton = getByLabelText("search.inputLabel");
    const filterInput = container.querySelector("#filter");

    fireEvent.change(filterInput, { target: { value: "Pitch" } });
    fireEvent.click(searchButton);
    expect(container.querySelector(".icon").textContent).toBe("");
  });
});

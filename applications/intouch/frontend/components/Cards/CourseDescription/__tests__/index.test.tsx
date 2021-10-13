import React from "react";
import { render } from "@testing-library/react";
import { CourseDescription } from "..";
import I18nextProvider from "../../../../lib/tests/fixtures/i18n";

describe("CourseDescription component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <I18nextProvider>
        <CourseDescription
          title="Basic competency programme (BCP)"
          type="Pitched roof"
          technology="PITCHED"
        >
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem
            architecto placeat inventore nostrum voluptates deserunt possimus
            laborum autem eum? Cum temporibus debitis delectus veniam, deleniti
            sequi nobis ipsa explicabo voluptate!
          </p>
        </CourseDescription>
      </I18nextProvider>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("should not show technology button if technology not exist", () => {
    const { container } = render(
      <I18nextProvider>
        <CourseDescription
          title="Basic competency programme (BCP)"
          type="Pitched roof"
        >
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem
            architecto placeat inventore nostrum voluptates deserunt possimus
            laborum autem eum? Cum temporibus debitis delectus veniam, deleniti
            sequi nobis ipsa explicabo voluptate!
          </p>
        </CourseDescription>
      </I18nextProvider>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});

import React from "react";
import { render } from "@testing-library/react";
import { CourseDescription } from "..";

describe("CourseDescription component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <CourseDescription
        title="Basic competency programme (BCP)"
        type="Pitched roof"
        status="In progress"
        image="https://source.unsplash.com/MjLrM8rVMC0/799x500/?architecture"
      >
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem
          architecto placeat inventore nostrum voluptates deserunt possimus
          laborum autem eum? Cum temporibus debitis delectus veniam, deleniti
          sequi nobis ipsa explicabo voluptate!
        </p>
      </CourseDescription>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});

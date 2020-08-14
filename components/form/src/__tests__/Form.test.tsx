import React from "react";
import Form from "../";
import { render } from "@testing-library/react";

describe("TextField component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <Form>
        <Form.Row>
          <p>Lorem Ipsum</p>
        </Form.Row>
        <Form.SubmitButton>Submit</Form.SubmitButton>
      </Form>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});

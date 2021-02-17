import React from "react";
import { render } from "@testing-library/react";
import Form from "../";

describe("Form component", () => {
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
  it("renders with a multiple buttons", () => {
    const { container } = render(
      <Form>
        <Form.Row>
          <p>Lorem Ipsum</p>
        </Form.Row>
        <Form.ButtonWrapper>
          <Form.Button>Cancel</Form.Button>
          <Form.SubmitButton>Submit</Form.SubmitButton>
        </Form.ButtonWrapper>
      </Form>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders with a right aligned button", () => {
    const { container } = render(
      <Form rightAlignButton>
        <Form.Row>
          <p>Lorem Ipsum</p>
        </Form.Row>
        <Form.ButtonWrapper>
          <Form.SubmitButton>Submit</Form.SubmitButton>
        </Form.ButtonWrapper>
      </Form>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});

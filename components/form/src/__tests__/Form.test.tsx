import "@testing-library/jest-dom";
import React, { useContext, useEffect } from "react";
import { fireEvent, render } from "@testing-library/react";
import Form, { FormContext, withFormControl } from "../";

const Component = () => {
  const { values, updateFormState } = useContext(FormContext);
  useEffect(() => {
    updateFormState(
      {
        test: "test"
      },
      {}
    );
  }, []);

  return <input data-testid="id" value={values["test"] as string} />;
};

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
    expect(container).toMatchSnapshot();
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
    expect(container).toMatchSnapshot();
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
    expect(container).toMatchSnapshot();
  });

  it("test submit form", () => {
    const onSubmit = jest.fn();
    const { getByTestId } = render(
      <Form onSubmit={onSubmit} data-testid="form">
        <Form.Row>
          <input type="text" name="text" data-testid="id" />
        </Form.Row>
        <Form.ButtonWrapper>
          <Form.SubmitButton>Submit</Form.SubmitButton>
        </Form.ButtonWrapper>
      </Form>
    );
    const textInput = getByTestId("id");
    fireEvent.change(textInput, {
      target: { value: "test" }
    });
    fireEvent.submit(getByTestId("form"));
    expect(onSubmit).toHaveBeenCalled();
  });

  it("test values passed to updateFormState function from context to be called on submit", () => {
    const onSubmit = jest.fn();
    const { getByTestId } = render(
      <Form onSubmit={onSubmit} data-testid="form">
        <Component />
      </Form>
    );
    const input = getByTestId("id");
    const form = getByTestId("form");
    fireEvent.click(input);
    fireEvent.submit(form);
    expect(onSubmit).toHaveBeenCalledWith(expect.any(Object), { test: "test" });
  });

  it("should not call onSubmit when it not pass for wrapped with formContext coponent", () => {
    const onSubmit = jest.fn();
    const { getByTestId } = render(
      <Form data-testid="form">
        <Component />
      </Form>
    );
    const form = getByTestId("form");
    fireEvent.submit(form);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("test withFormControl calls onChange", () => {
    const mockComponent = jest.fn(({ ...props }) => (
      <input type="text" name="test" data-testid="id" {...props} />
    ));
    const WithFormControlComponent = withFormControl(mockComponent);
    const onChange = jest.fn();
    const { getByTestId, container } = render(
      <WithFormControlComponent
        name="test"
        onChange={onChange}
        defaultValue="Value"
      />
    );
    expect(container).toMatchSnapshot();
    const input = getByTestId("id");
    fireEvent.change(input, { target: { value: "Text" } });
    expect(onChange).toHaveBeenCalled();
  });

  it("test withFormControl not calls onChange", () => {
    const mockComponent = jest.fn(({ ...props }) => (
      <input type="text" name="test" data-testid="id" {...props} />
    ));
    const WithFormControlComponent = withFormControl(mockComponent);
    const onChange = jest.fn();
    const { getByTestId, container } = render(
      <WithFormControlComponent name="test" defaultValue="Value" />
    );
    expect(container).toMatchSnapshot();
    const input = getByTestId("id");
    fireEvent.change(input, { target: { value: "Text" } });
    expect(onChange).not.toHaveBeenCalled();
  });

  it("test withFormControl calls onBlur", () => {
    const mockComponent = jest.fn(({ ...props }) => (
      <input type="text" name="test" data-testid="id" {...props} />
    ));
    const getValidationErrorMock = jest.fn().mockImplementation(() => "error");
    const WithFormControlComponent = withFormControl(mockComponent);
    const { getByTestId } = render(
      <WithFormControlComponent
        name="test"
        isRequired={true}
        getValidationError={getValidationErrorMock}
        value="test"
      />
    );
    const input = getByTestId("id");
    fireEvent.blur(input);
    expect(input).toHaveAttribute("errortext", "error");
  });

  it("test withFormControl with fieldIsRequiredError", () => {
    const mockComponent = jest.fn(({ ...props }) => (
      <input type="text" name="test" data-testid="id" {...props} />
    ));
    const WithFormControlComponent = withFormControl(mockComponent);
    const { getByTestId } = render(
      <WithFormControlComponent
        name="test"
        fieldIsRequiredError="fieldIsRequiredError"
        isRequired={true}
      />
    );
    const input = getByTestId("id");
    expect(input).toHaveAttribute("errortext", "fieldIsRequiredError");
  });

  it("test withFormControl with no fieldIsRequiredError and value", () => {
    const mockComponent = jest.fn(({ ...props }) => (
      <input type="text" name="test" data-testid="id" {...props} />
    ));
    const WithFormControlComponent = withFormControl(mockComponent);
    const { container } = render(
      <WithFormControlComponent name="test" isRequired={true} />
    );
    expect(container).toMatchSnapshot();
  });
});

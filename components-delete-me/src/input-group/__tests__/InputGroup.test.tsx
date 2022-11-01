import React from "react";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import Button from "../../button/Button";
import TextField from "../../text-field/TextField";
import InputGroup from "../InputGroup";
import { renderWithThemeProvider } from "../../__tests__/helper";

describe("InputGroup component", () => {
  it("renders correctly", () => {
    const { container } = renderWithThemeProvider(
      <InputGroup
        input={<TextField name="first-name" label="First name" />}
        button={<Button>Submit</Button>}
      />
    );
    expect(container).toMatchSnapshot();
  });
  it("renders unlocked", () => {
    const { container } = renderWithThemeProvider(
      <InputGroup
        lockBreakpoint={false}
        input={<TextField name="first-name" label="First name" />}
        button={<Button>Submit</Button>}
      />
    );
    expect(container).toMatchSnapshot();
  });
  it("renders with an IconButton", () => {
    const { container } = renderWithThemeProvider(
      <InputGroup
        lockBreakpoint={false}
        input={<TextField name="first-name" label="First name" />}
        button={
          <Button accessibilityLabel="Submit" isIconButton>
            <ArrowForwardIcon />
          </Button>
        }
      />
    );
    expect(container).toMatchSnapshot();
  });
});

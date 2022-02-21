import React from "react";
import { render } from "@testing-library/react";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import Button from "../../button/Button";
import TextField from "../../text-field/TextField";
import InputGroup from "../InputGroup";

describe("InputGroup component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <InputGroup
        input={<TextField name="first-name" label="First name" />}
        button={<Button>Submit</Button>}
      />
    );
    expect(container).toMatchSnapshot();
  });
  it("renders unlocked", () => {
    const { container } = render(
      <InputGroup
        lockBreakpoint={false}
        input={<TextField name="first-name" label="First name" />}
        button={<Button>Submit</Button>}
      />
    );
    expect(container).toMatchSnapshot();
  });
  it("renders with an IconButton", () => {
    const { container } = render(
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

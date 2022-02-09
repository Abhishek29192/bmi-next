import React from "react";
import { render } from "@testing-library/react";
import Typography from "@bmi/typography";
import EmailIcon from "@material-ui/icons/Email";
import WarningIcon from "@material-ui/icons/Warning";
import ResponseMessage from "../";

describe("ResponseMessage component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <ResponseMessage title="Thank you!" icon={EmailIcon} />
    );
    expect(container).toMatchSnapshot();
  });
  it("renders correctly with children", () => {
    const { container } = render(
      <ResponseMessage title="Thank you!" icon={EmailIcon}>
        <Typography style={{ padding: "10px 0" }}>
          Your email has been sent.
        </Typography>
        <Typography style={{ padding: "10px 0" }}>
          We&apos;ll get back to you as soon as we can.
        </Typography>
      </ResponseMessage>
    );
    expect(container).toMatchSnapshot();
  });
  it("renders correctly with error", () => {
    const { container } = render(
      <ResponseMessage title="Error" icon={WarningIcon} error />
    );
    expect(container).toMatchSnapshot();
  });
});

import React from "react";
import EmailIcon from "@material-ui/icons/Email";
import WarningIcon from "@material-ui/icons/Warning";
import Typography from "../../typography/Typography";
import ResponseMessage from "../ResponseMessage";
import { renderWithThemeProvider } from "../../__tests__/helper";

describe("ResponseMessage component", () => {
  it("renders correctly", () => {
    const { container } = renderWithThemeProvider(
      <ResponseMessage title="Thank you!" icon={EmailIcon} />
    );
    expect(container).toMatchSnapshot();
  });
  it("renders correctly with children", () => {
    const { container } = renderWithThemeProvider(
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
    const { container } = renderWithThemeProvider(
      <ResponseMessage title="Error" icon={WarningIcon} error />
    );
    expect(container).toMatchSnapshot();
  });
});

/* eslint-disable no-console */
import mockConsole from "jest-mock-console";

beforeAll(() => {
  mockConsole();
});

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
});

describe("info", () => {
  it("should log at the info level", async () => {
    const logger = (await import("..")).default;
    logger.info({ message: "info-message", some: "extra-property" });
    expect(console.log).toHaveBeenCalledWith(
      JSON.stringify({
        severity: "INFO",
        message: "info-message",
        some: "extra-property"
      })
    );
  });

  it("should set the trace key if initialize called before", async () => {
    const logger = (await import("..")).default;
    logger.initialize("trace-key");
    logger.info({ message: "initialize-info", some: "extra-property" });
    expect(console.log).toHaveBeenCalledWith(
      JSON.stringify({
        severity: "INFO",
        "logging.googleapis.com/trace": `projects/${process.env.GCP_PROJECT_ID}/traces/trace-key`,
        message: "initialize-info",
        some: "extra-property"
      })
    );
  });
});

describe("debug", () => {
  it("should log at the debug level", async () => {
    const logger = (await import("..")).default;
    logger.debug({ message: "debug-message", some: "extra-property" });
    expect(console.log).toHaveBeenCalledWith(
      JSON.stringify({
        severity: "DEBUG",
        message: "debug-message",
        some: "extra-property"
      })
    );
  });

  it("should set the trace key if initialize called before", async () => {
    const logger = (await import("..")).default;
    logger.initialize("trace-key");
    logger.debug({ message: "initialize-debug", some: "extra-property" });
    expect(console.log).toHaveBeenCalledWith(
      JSON.stringify({
        severity: "DEBUG",
        "logging.googleapis.com/trace": `projects/${process.env.GCP_PROJECT_ID}/traces/trace-key`,
        message: "initialize-debug",
        some: "extra-property"
      })
    );
  });
});

describe("notice", () => {
  it("should log at the notice level", async () => {
    const logger = (await import("..")).default;
    logger.notice({ message: "notice-message", some: "extra-property" });
    expect(console.log).toHaveBeenCalledWith(
      JSON.stringify({
        severity: "NOTICE",
        message: "notice-message",
        some: "extra-property"
      })
    );
  });

  it("should set the trace key if initialize called before", async () => {
    const logger = (await import("..")).default;
    logger.initialize("trace-key");
    logger.notice({ message: "initialize-notice", some: "extra-property" });
    expect(console.log).toHaveBeenCalledWith(
      JSON.stringify({
        severity: "NOTICE",
        "logging.googleapis.com/trace": `projects/${process.env.GCP_PROJECT_ID}/traces/trace-key`,
        message: "initialize-notice",
        some: "extra-property"
      })
    );
  });
});

describe("warning", () => {
  it("should log at the warning level", async () => {
    const logger = (await import("..")).default;
    logger.warning({ message: "warning-message", some: "extra-property" });
    expect(console.log).toHaveBeenCalledWith(
      JSON.stringify({
        severity: "WARNING",
        message: "warning-message",
        some: "extra-property"
      })
    );
  });

  it("should set the trace key if initialize called before", async () => {
    const logger = (await import("..")).default;
    logger.initialize("trace-key");
    logger.warning({ message: "initialize-warning", some: "extra-property" });
    expect(console.log).toHaveBeenCalledWith(
      JSON.stringify({
        severity: "WARNING",
        "logging.googleapis.com/trace": `projects/${process.env.GCP_PROJECT_ID}/traces/trace-key`,
        message: "initialize-warning",
        some: "extra-property"
      })
    );
  });
});

describe("error", () => {
  it("should log at the error level", async () => {
    const logger = (await import("..")).default;
    logger.error({ message: "error-message", some: "extra-property" });
    expect(console.log).toHaveBeenCalledWith(
      JSON.stringify({
        severity: "ERROR",
        message: "error-message",
        some: "extra-property"
      })
    );
  });

  it("should set the trace key if initialize called before", async () => {
    const logger = (await import("..")).default;
    logger.initialize("trace-key");
    logger.error({ message: "initialize-error", some: "extra-property" });
    expect(console.log).toHaveBeenCalledWith(
      JSON.stringify({
        severity: "ERROR",
        "logging.googleapis.com/trace": `projects/${process.env.GCP_PROJECT_ID}/traces/trace-key`,
        message: "initialize-error",
        some: "extra-property"
      })
    );
  });
});

describe("critical", () => {
  it("should log at the critical level", async () => {
    const logger = (await import("..")).default;
    logger.critical({ message: "critical-message", some: "extra-property" });
    expect(console.log).toHaveBeenCalledWith(
      JSON.stringify({
        severity: "CRITICAL",
        message: "critical-message",
        some: "extra-property"
      })
    );
  });

  it("should set the trace key if initialize called before", async () => {
    const logger = (await import("..")).default;
    logger.initialize("trace-key");
    logger.critical({ message: "initialize-critical", some: "extra-property" });
    expect(console.log).toHaveBeenCalledWith(
      JSON.stringify({
        severity: "CRITICAL",
        "logging.googleapis.com/trace": `projects/${process.env.GCP_PROJECT_ID}/traces/trace-key`,
        message: "initialize-critical",
        some: "extra-property"
      })
    );
  });
});

describe("alert", () => {
  it("should log at the alert level", async () => {
    const logger = (await import("..")).default;
    logger.alert({ message: "alert-message", some: "extra-property" });
    expect(console.log).toHaveBeenCalledWith(
      JSON.stringify({
        severity: "ALERT",
        message: "alert-message",
        some: "extra-property"
      })
    );
  });

  it("should set the trace key if initialize called before", async () => {
    const logger = (await import("..")).default;
    logger.initialize("trace-key");
    logger.alert({ message: "initialize-alert", some: "extra-property" });
    expect(console.log).toHaveBeenCalledWith(
      JSON.stringify({
        severity: "ALERT",
        "logging.googleapis.com/trace": `projects/${process.env.GCP_PROJECT_ID}/traces/trace-key`,
        message: "initialize-alert",
        some: "extra-property"
      })
    );
  });
});

describe("emergency", () => {
  it("should log at the emergency level", async () => {
    const logger = (await import("..")).default;
    logger.emergency({ message: "emergency-message", some: "extra-property" });
    expect(console.log).toHaveBeenCalledWith(
      JSON.stringify({
        severity: "EMERGENCY",
        message: "emergency-message",
        some: "extra-property"
      })
    );
  });

  it("should set the trace key if initialize called before", async () => {
    const logger = (await import("..")).default;
    logger.initialize("trace-key");
    logger.emergency({
      message: "initialize-emergency",
      some: "extra-property"
    });
    expect(console.log).toHaveBeenCalledWith(
      JSON.stringify({
        severity: "EMERGENCY",
        "logging.googleapis.com/trace": `projects/${process.env.GCP_PROJECT_ID}/traces/trace-key`,
        message: "initialize-emergency",
        some: "extra-property"
      })
    );
  });
});

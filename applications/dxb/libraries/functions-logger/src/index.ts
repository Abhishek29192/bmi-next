/* eslint-disable no-console */
/**
 * A set of util functions to log at appropriate levels for GCP Cloud Functions
 * as it treats all stdout logs as `DEFAULT` and all stderr as `ERROR`.
 * @link https://cloud.google.com/functions/docs/monitoring/logging#writing_runtime_logs
 *
 * Log severity levels are defined in order (lowest to highest):
 * DEFAULT    (0) The log entry has no assigned severity level.
 * DEBUG      (100) Debug or trace information.
 * INFO       (200) Routine information, such as ongoing status or performance.
 * NOTICE     (300) Normal but significant events, such as start up, shut down, or a configuration change.
 * WARNING    (400) Warning events might cause problems.
 * ERROR      (500) Error events are likely to cause problems.
 * CRITICAL   (600) Critical events cause more severe problems or outages.
 * ALERT      (700) A person must take an action immediately.
 * EMERGENCY  (800) One or more systems are unusable.
 * @link https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry#logseverity
 */

const globalLogFields: { [key: string]: any } = {};

export type LogMessage = {
  message?: string;
  [key: string]: any;
};

/**
 * Sets the trace key for any corresponding uses of the logging.
 *
 * Should be retrieved from the `X-Cloud-Trace-Context` header, which should be
 * int the format `TRACE_ID/SPAN_ID;o=TRACE_TRUE`.
 * For example:
 * `X-Cloud-Trace-Context: 105445aa7843bc8bf206b12000100000/1;o=1`
 *
 * @link https://cloud.google.com/trace/docs/setup#force-trace
 *
 * @param traceId key to use for tracing the logs
 */
export const initialize = (traceId: string) => {
  globalLogFields[
    "logging.googleapis.com/trace"
  ] = `projects/${process.env.GCP_PROJECT_ID}/traces/${traceId}`;
};

export const info = (logMessage: LogMessage) => {
  console.log(
    JSON.stringify({ severity: "INFO", ...globalLogFields, ...logMessage })
  );
};

export const debug = (logMessage: LogMessage) => {
  console.log(
    JSON.stringify({ severity: "DEBUG", ...globalLogFields, ...logMessage })
  );
};

export const notice = (logMessage: LogMessage) => {
  console.log(
    JSON.stringify({ severity: "NOTICE", ...globalLogFields, ...logMessage })
  );
};

export const warning = (logMessage: LogMessage) => {
  console.log(
    JSON.stringify({ severity: "WARNING", ...globalLogFields, ...logMessage })
  );
};

export const error = (logMessage: LogMessage) => {
  console.log(
    JSON.stringify({ severity: "ERROR", ...globalLogFields, ...logMessage })
  );
};

export const critical = (logMessage: LogMessage) => {
  console.log(
    JSON.stringify({ severity: "CRITICAL", ...globalLogFields, ...logMessage })
  );
};

export const alert = (logMessage: LogMessage) => {
  console.log(
    JSON.stringify({ severity: "ALERT", ...globalLogFields, ...logMessage })
  );
};

export const emergency = (logMessage: LogMessage) => {
  console.log(
    JSON.stringify({ severity: "EMERGENCY", ...globalLogFields, ...logMessage })
  );
};

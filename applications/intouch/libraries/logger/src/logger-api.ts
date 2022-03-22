// Imports the Google Cloud client library
import { Logging } from "@google-cloud/logging";
import { LogEntry } from "@google-cloud/logging/build/src/entry";

type LogEvent = {
  severity: string;
  message: string;
};

// Creates a client
const logging = new Logging();

const log = async ({ severity, message }: LogEvent) => {
  // Selects the log to write to
  const log = logging.log(
    process.env.LOG_SERVICE_NAME || "run.googleapis.com/intouch"
  );

  // The metadata associated with the entry
  const metadata: LogEntry = {
    resource: {
      type: process.env.LOG_RESOURCE_TYPE || "cloud_run_revision",
      labels: {
        configuration_name: process.env.K_CONFIGURATION || "", // set by cloud run
        service_name: process.env.K_SERVICE || "", // set by cloud run
        revision_name: process.env.K_REVISION || "" // set by cloud run
      }
    },
    severity
  };

  const entry = log.entry(metadata, message);

  await log.write(entry);
};

export default log;

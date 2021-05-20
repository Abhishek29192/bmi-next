// Imports the Google Cloud client library
import { Logging } from "@google-cloud/logging";

type LogEvent = {
  severity: string;
  message: string;
};

// Creates a client
const logging = new Logging();

const log = async ({ severity, message }: LogEvent) => {
  // Selects the log to write to
  const log = logging.log("Frontend");

  // The metadata associated with the entry
  const metadata = {
    resource: { type: "global" },
    severity
  };

  const entry = log.entry(metadata, message);

  await log.write(entry);
};

export default log;

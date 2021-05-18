type LogEvent = {
  severity: "INFO" | "DEBUG" | "ERROR";
  message: string;
};

const log = (event: LogEvent) =>
  fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/log`, {
    method: "POST",
    body: JSON.stringify(event)
  });

export default log;

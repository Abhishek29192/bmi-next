type LogEvent = {
  severity: "INFO" | "DEBUG" | "ERROR";
  message: string;
};

const log = (event: LogEvent) => {
  fetch(`${window.location.protocol}//${window.location.host}/api/log`, {
    method: "POST",
    body: JSON.stringify(event)
  });
};

export default log;

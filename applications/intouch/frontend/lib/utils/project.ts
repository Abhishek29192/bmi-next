export enum ProjectStatus {
  NOT_STARTED = "Not started",
  IN_PROGRESS = "In progress",
  COMPLETED = "Completed"
}

export const getProjectStatus = (startDate, endDate) => {
  const now = Date.now();
  startDate = new Date(startDate).getTime();
  endDate = new Date(endDate).getTime();

  // Start date in the future
  if (startDate > now) {
    return ProjectStatus.NOT_STARTED;
  }

  // End date in the past
  if (endDate < now) {
    return ProjectStatus.COMPLETED;
  }

  // now between start and end date
  if (startDate <= now && now <= endDate) {
    return ProjectStatus.IN_PROGRESS;
  }

  // TODO: Invalid, log it?
  return ProjectStatus.NOT_STARTED;
};

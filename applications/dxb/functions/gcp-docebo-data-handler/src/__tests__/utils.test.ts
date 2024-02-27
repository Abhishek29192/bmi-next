import { getUnique, isMultipleEventsPayload } from "../utils";
import {
  createCourseDeletedEvent,
  createMultipleCoursesDeletedEvent
} from "./helpers/createEvent";

describe("getUnique util", () => {
  it("should return only unique items", () => {
    const res = getUnique([1, 1, 2, 3, 4, 5, 5]);
    expect(res).toEqual([1, 2, 3, 4, 5]);
  });

  it("works correctly with an empty array", () => {
    expect(getUnique([])).toEqual([]);
  });
});

describe("isMultipleEventsPayload util", () => {
  it("returns false if single-payload event passed", () => {
    const event = createCourseDeletedEvent();
    const res = isMultipleEventsPayload(event);
    expect(res).toBe(false);
  });

  it("returns true if an event with multiple payloads passed", () => {
    const event = createMultipleCoursesDeletedEvent();
    const res = isMultipleEventsPayload(event);
    expect(res).toBe(true);
  });
});

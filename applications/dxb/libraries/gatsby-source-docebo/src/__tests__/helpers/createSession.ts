import { Session } from "../../types";

export const createSession = (session: Partial<Session> = {}): Session => ({
  code: "Test code",
  date_end: 1760101200000,
  date_start: 1696910400000,
  id: 1,
  name: "Test course session",
  hours: "8:45",
  events: "1",
  events_with_sync_failed: "0",
  instructors: "0",
  instructors_emails_number: 0,
  waiting: "0",
  enrolled: "2",
  max_enroll: "30",
  created_by: "13194",
  uid_session: "BJVR10V",
  externally_managed: false,
  additional_fields: [],
  attendance_details: {
    onsite: 1,
    online: 0,
    flexible: 0
  },
  location: {
    id: 3,
    name: "BMI Academy DK",
    address: "BMI Academy Holger Danske Vej 23C 8960 Randers SØ",
    count: 1
  },
  attendance_type: "onsite",
  ...session
});

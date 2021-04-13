import { gql } from "apollo-server";

export default gql`
  extend type Query {
    enrollmentsReport(
      branchId: Int!
      options: PageQueryOptions
    ): EnrollmentReportData
    certificationsReport: CertificationReportData
  }

  type EnrollmentReport {
    username: String
    fullname: String
    course_name: String
    course_code: String
    course_type: String
    enrollment_date: String
    completion_date: String
    status: String
    score: Int
    session_time: Int
    credits: Int
  }

  type EnrollmentReportData {
    count: Int
    has_more_data: Boolean
    cursor: String
    current_page: Int
    current_page_size: Int
    total_page_count: Int
    total_count: Int
    items: [EnrollmentReport]
  }

  type CertificationReport {
    user_idUser: String
    user_userid: String
    user_email: String
    certification_title: String
    certification_code: String
    certification_description: String
    certification_expiration: String
    enrollment_issued_on: String
    enrollment_to_renew_in: String
    enrollment_activity_name: String
    enrollment_activity_type: String
  }
  type CertificationReportData {
    items: [CertificationReport]
  }
`;

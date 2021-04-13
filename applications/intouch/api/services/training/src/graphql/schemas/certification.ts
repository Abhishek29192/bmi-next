import { gql } from "apollo-server";

export default gql`
  extend type Query {
    certifications(options: PageQueryOptions): CertificationData
  }
  type Certification {
    id_cert: Int
    title: String
    description: String
    duration: String
    allow_same_item: Boolean
    duration_unit: String
    code: String
  }

  type CertificationData {
    count: Int
    cursor: String
    has_more_data: Boolean
    current_page: Int
    current_page_size: Int
    total_page_count: Int
    total_count: Int
    sort: [Sort]
    items: [Certification]
  }
`;

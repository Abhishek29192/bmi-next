import { gql } from "@apollo/client";

export const GET_TRAINING = gql`
  query trainings {
    training {
      name
      url
      user {
        id
        email
        user_level
        username
        firstname
        lastname
        enrollment {
          count
          has_more_data
          current_page
          current_page_size
          total_page_count
          total_count
          items {
            id
            name
            description
            status
            image_url
            url
            type
            level
          }
        }
      }
    }
  }
`;

import { gql } from "apollo-server";

export default gql`
  extend type Query {
    training: TrainingInfo
  }

  type TrainingInfo {
    name: String
    url: String
    user: TrainingUser
  }
  type TrainingUser {
    id: Int
    username: String
    firstname: String
    lastname: String
    email: String
    user_level: String
    userInfo: UserInfo
    enrollment: Enrollment
  }
`;

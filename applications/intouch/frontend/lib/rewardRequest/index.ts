import { gql } from "@apollo/client";

export const REWARD_RECORD_FRAGMENT = gql`
  fragment RewardRequestFragment on RewardRequest {
    id
    marketId
    accountId
    companyId
    redemptionCode
    rewardPoint
  }
`;

export const mutationCreateRewardRequest = gql`
  mutation createRewardRequest($input: CreateRewardRequestInput!) {
    createRewardRequest(input: $input) {
      rewardRequest {
        ...RewardRequestFragment
      }
    }
  }
`;

export const queryGetRewardRequest = gql`
  query getRewardRequests($companyId: Int) {
    rewardRequests(condition: { companyId: $companyId }) {
      nodes {
        ...RewardRequestFragment
      }
    }
  }
`;

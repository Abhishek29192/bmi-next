import { gql } from "@apollo/client";

export const REWARD_RECORD_FRAGMENT = gql`
  fragment RewardRecordFragment on CompanyRewardRecord {
    id
    marketId
    accountId
    companyId
    rewardTier
    rewardPoint
    createdAt
    updatedAt
  }
`;

export const mutationGetCompanyRewardRecord = gql`
  mutation getCompanyRewardRecord($input: GetCompanyRewardRecordInput!) {
    getCompanyRewardRecord(input: $input) {
      total
      points
      records {
        ...RewardRecordFragment
      }
    }
  }
`;

export const mutationAddRewardRecord = gql`
  mutation addRewardRecord($input: AddRewardRecordInput!) {
    addRewardRecord(input: $input) {
      ...RewardRecordFragment
    }
  }
`;

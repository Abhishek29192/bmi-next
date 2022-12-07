import { gql } from "@apollo/client";

export const REWARD_TIER_FRAGMENT = gql`
  fragment RewardTierFragment on RewardTier {
    id
    tierCode
    rewardCategory
    rewardPoint
  }
`;

export const queryRewardTierByMarketId = gql`
  query queryRewardTierByMarketId($marketId: Int!) {
    rewardTiers(
      condition: { marketId: $marketId }
      orderBy: REWARD_CATEGORY_ASC
    ) {
      nodes {
        ...RewardTierFragment
      }
    }
  }
`;

export const mutationUpdateRewardTiers = gql`
  mutation updateRewardTiers($input: UpdateRewardTiersInput!) {
    updateRewardTiers(input: $input) {
      ...RewardTierFragment
    }
  }
`;

import {
  GetEvidenceItemsReportQuery,
  GetProjectQuery
} from "../../../graphql/generated/operations";
import { projectFactory } from "../../../lib/tests/factories/project";
import {
  guaranteeFactory,
  MockGuarantee
} from "../../../lib/tests/factories/guarantee";
import { generateAccount } from "../../../lib/tests/factories/account";
import { AccountConfig } from "../factories/account";

export type MockEvidenceItem = Partial<
  {
    project?: Partial<GetProjectQuery["project"]>;
    guarantee?: Partial<MockGuarantee>;
    account?: Partial<AccountConfig>;
  } & GetEvidenceItemsReportQuery["evidenceItemsByMarket"]["nodes"][0]
>;

export const evidenceItemFactory = ({
  project,
  guarantee,
  account,
  ...evidenceItem
}: MockEvidenceItem = {}) => ({
  evidenceCategoryType: "PROOF_OF_PURCHASE",
  name: "evidence-item.jpg",
  uploaderAccountId: 1,
  createdAt: "2022-01-27 12:51:39.999501",
  project: {
    ...projectFactory(),
    ...project
  },
  guarantee: {
    ...guaranteeFactory(),
    ...guarantee
  },
  uploaderAccount: {
    ...generateAccount(),
    ...account
  },
  ...evidenceItem
});

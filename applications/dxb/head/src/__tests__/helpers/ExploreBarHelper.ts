import { createInternalLinkData } from "./LinkHelper";
import type { Data as ExploreBarProps } from "../../components/ExploreBar";

const createExploreBarData = (
  data?: Partial<ExploreBarProps>
): ExploreBarProps => ({
  label: "Explore More",
  links: [createInternalLinkData()],
  ...data
});

export default createExploreBarData;

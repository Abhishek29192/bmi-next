import createLinkData from "../../../../__tests__/helpers/LinkHelper";
import type { LocalTool } from "../../types";

const createLocalTool = (tool?: Partial<LocalTool>): LocalTool => ({
  title: "Internal tool title",
  type: "Calculator",
  link: createLinkData(),
  ...tool
});

export default createLocalTool;

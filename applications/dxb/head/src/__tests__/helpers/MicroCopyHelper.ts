import type { Data as MicroCopyData } from "../../components/MicroCopy";

const createMicroCopy = (
  microCopy?: Partial<MicroCopyData>
): MicroCopyData => ({
  key: "microCopy.key",
  value: "microCopy.value",
  ...microCopy
});

export default createMicroCopy;

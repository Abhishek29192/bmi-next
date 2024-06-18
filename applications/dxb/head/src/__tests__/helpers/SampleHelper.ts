import { Sample } from "../../contexts/SampleBasketContext";

const createSampleData = (sample?: Partial<Sample>): Sample => ({
  name: "sample-1",
  code: "sample-1-code",
  path: "sample-1-path",
  colour: null,
  textureFamily: null,
  measurements: undefined,
  image: undefined,
  goodBetterBest: undefined,
  ...sample
});

export default createSampleData;

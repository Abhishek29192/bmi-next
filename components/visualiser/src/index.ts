import tilesData from "../data/tiles.json";
import sidingsData from "../data/sidings.json";
import Visualiser from "./Visualiser";

const { tiles: tilesSetData } = tilesData;
const { sidings: sidingsSetData } = sidingsData;

export { tilesSetData, sidingsSetData };

export type { Parameters } from "./Visualiser";

export default Visualiser;

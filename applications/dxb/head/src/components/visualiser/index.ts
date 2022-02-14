import tilesData from "./data/tiles.json";
import sidingsData from "./data/sidings.json";
import Visualiser from "./Visualiser";
import { Siding, Tile } from "./Types";

const tilesSetData = tilesData.tiles as Tile[];
const sidingsSetData = sidingsData.sidings as Siding[];

export { tilesSetData, sidingsSetData };

export type { Parameters } from "./Visualiser";

export default Visualiser;

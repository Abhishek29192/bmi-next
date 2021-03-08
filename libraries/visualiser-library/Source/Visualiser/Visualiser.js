import logo from './images/logo.png';
import homeIcon from './images/homeIcon.png';
import tileIcon from './images/tileIcon.png';
import TileViewer from './TileViewer/TileViewer.js';
import {getUrlArgs, buildUrl} from './Functions/UrlArgs/UrlArgs.js';
import HouseViewer from './HouseViewer/HouseViewer.js';
import TileSelector from './TileSelector/TileSelector.js';
import WallSelector from './WallSelector/WallSelector.js';
import icon_close from './images/icon_close.svg';
import icon_share from './images/icon_share.svg';
import asset_tiles from './images/asset_tiles.svg';
import asset_tile from './images/asset_tile.svg';
import asset_home from './images/asset_home.svg';

export default class Visualiser extends React.Component {
	// If you want to use state in your react component, uncomment this constructor:
	constructor(props) {
		super(props);

		this.state = {
			viewMode: "tile",
			isTileSelectorVisible: false,
			tiles: null,
            sidings: null,
		};
	}

	componentDidMount(){
		this.load();
	}

	componentWillReceiveProps(props) {
		this.load();
	}

	load() {
		var searchArgs = getUrlArgs();

		// Update state:
		var stateChange = {searchArgs};

		if (this.props.tiles && searchArgs.tileId != this.state.tileId) {
			stateChange.tileId = searchArgs.tileId;

			// Must also force color to change unless it's set as well:
			if (!searchArgs.colourId) {
				stateChange.colourId = 0;
			}

			stateChange.tile = this.props.tiles.find(tile => tile.id == stateChange.tileId);
		}

		if (searchArgs.colourId != this.state.colourId) {
			stateChange.colourId = searchArgs.colourId;
		}

		if (this.props.sidings && searchArgs.sidingId != this.state.sidingId) {
			stateChange.sidingId = searchArgs.sidingId;

            stateChange.siding = this.props.sidings.find(siding => siding.id == stateChange.sidingId);
		}

		if (searchArgs.viewMode != this.state.viewMode) {
			stateChange.viewMode = searchArgs.viewMode;
		}

		this.setState(stateChange);
	}

	render() {
		var {viewMode, tile, siding, colourId} = this.state;
		var {tiles, sidings} = this.props;

		if (!tiles || !sidings) {
			return 'tiles/sidings props are required';
		}

		var colour = null;

		if (tile) {
			if (!tile.colours || !tile.colours.length) {
				tile = null;
			} else {
				colour = tile.colours.find(col => col.id == colourId);
				if (!colour) {
					// Use first as default:
					colour = tile.colours[0];
				}
			}
		}

		return <div className="main-page">
      <TileSelector
				tiles={tiles}
				onClose = {() => this.setState({isTileSelectorVisible: false})}
				isVisible={this.state.isTileSelectorVisible}
			/>

      <WallSelector
                sidings={sidings}
				onClose = {() => this.setState({isWallSelectorVisible: false})}
				isVisible={this.state.isWallSelectorVisible}
			/>

			<div className="tile-info-container">
        {/* BMI tile view */}
				<div className="logo-container">
					<img className="logo" src={logo}/>
					<h2>Takvisualiserer</h2>
				</div>

        {/* Tile name */}
				{tile && <h5 className="tile-name">{tile.name}</h5>}

        {/* Tile colour */}
				{colour && <h6 className="colour-name">{colour.name}</h6>}

        {/* External link */}
				{tile && tile.productUrl && <a className="product-details-link flat-btn" href={tile.productUrl} target="_blank">Se fler detaljer</a>}
			</div>

			<div className="misc-container">
				<button className="misc-btn share-product" onClick={() =>
					this.props.onShare && this.props.onShare({
						tile,
						siding,
						colour
					})
				}>
					<img src={icon_share} alt="" role="presentation" />
				</button>


				<button className="misc-btn close-tile-visualiser" onClick={() =>
					this.props.onClose && this.props.onClose()
				}>
					<img src={icon_close} alt="" role="presentation" />
				</button>
			</div>

			<ul className="nav-container">
				{/* Tile selector */}
				<li src={tileIcon} onClick={() => this.setState({ isTileSelectorVisible: true })}>
				  <span className="icon-button">
						<img src={asset_tiles} />
					</span>
				  <span>Velg produkt</span>
				</li>

				{/* Wall colour view */}
				{viewMode == "roof3d" && <li onClick={() => this.setState({ isWallSelectorVisible: true })}>
					<span className="icon-button">
						<img className="asset-home" src={asset_home} />
					</span>
					<span>Farge pa vegg</span>
				</li>}

				{viewMode == "tile" && <li className="disabled">
				  <span className="icon-button">
						<img className="asset-home" src={asset_home} />
					</span>
				  <span>Farge pa vegg</span>
				</li>}

				{/* 3d mode switch */}
				{viewMode == "tile" && <li>
					<a href={buildUrl({ viewMode: 'roof3d' })}>
						<span className="icon-button">
							<img className="asset-home" src={asset_home} />
						</span>
						<span>Vis meg tak</span>
					</a>
				</li>}

				{viewMode == "roof3d" && <li>
					<a href={buildUrl({ viewMode: 'tile' })}>
						<span className="icon-button">
							<img src={asset_tile} />
						</span>
						<span>Kun produktet</span>
					</a>
				</li>}
			</ul>

			<div className="center-content">
				{tile && viewMode == "roof3d" && <HouseViewer tile={tile} colour={colour} siding={siding}/>}
				{tile && viewMode == "tile" && <TileViewer tile={tile} colour={colour} />}
			</div>
		</div>;
	}
}


import {getUrlArgs, buildUrl} from '../Functions/UrlArgs/UrlArgs.js';
import getRef from '../Functions/GetRef/GetRef.js';
import icon_close from '../images/icon_close.svg';

export default class TileSelector extends React.Component {
	// If you want to use state in your react component, uncomment this constructor:
	constructor(props) {
		super(props);
		this.state = {};
		// example of how to reference this within a function
		// this.clickHandler = this.clickHandler.bind(this);
	}

	onClose() {
		this.props.onClose && this.props.onClose();
	}

	renderMaterial(name, id) {
    var searchArgs = getUrlArgs();

    var mat = this.props.tiles.filter(tile => tile.material == id);

		return <>
			<h2>{name}</h2>
			<ol className="tile-list">
				{mat && mat.map(tile => {
					var name = tile.name;

					if (tile.colours == null) {
						return null;
					}

					return tile.colours.map(colourEntry => {
						var isActiveTile = (searchArgs.tileId == tile.id) && (searchArgs.colourId == colourEntry.id);
						var myColor = isActiveTile ? "#009fe3" : "white";

						var imageUrl = getRef(colourEntry.previewRef, { url: true, size: '128' });

						return <li>
							<a className="toggle-card" href={buildUrl({tileId: tile.id, colourId: colourEntry.id})} onClick={() => this.onClose()}>
								<span style={{display: "inline-block", backgroundColor: myColor, width: "200px", height: "200px"}}>
									<center>
										<br/>
										<img src={imageUrl} style={{height: "100px"}}></img>
										<br/>
										{name}
										<br/>
										{colourEntry.name}
										<br/>
									</center>
								</span>
							</a>
						</li>;
					});
				})}
			</ol>
		</>;
	}

	render() {
		// reference propTypes
		//var { title, size, width } = this.props;

		return <div className="tile-selector-wrapper">
			{this.props.isVisible && <div className="tile-selector-modal">
				<div className="tile-selector-content">
				{/* Close button */}
				<button className="misc-btn close-selector" onClick={() => this.onClose()}>
					<img src={icon_close} alt="" role="presentation" />
				</button>

				{/* Title */}
				<h1>Velg produkt</h1>

				{/* Lists */}
				{this.renderMaterial('Betongtakstein', '1')}
				{this.renderMaterial('Telgtakstein', '2')}
				{this.renderMaterial('Takpanner', '3')}
				</div>
			</div>}
		</div>;
	}
}

TileSelector.propTypes = {};

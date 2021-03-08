import {getUrlArgs, buildUrl} from '../Functions/UrlArgs/UrlArgs.js';
import getRef from '../Functions/GetRef/GetRef.js';

export default class WallSelector extends React.Component {
	
    onClose() {
		this.props.onClose && this.props.onClose();
	}

	
	render(){
		// reference propTypes
		//var { title, size, width } = this.props;
        
        var searchArgs = getUrlArgs();
		
		return <div className="wall-selector">
            { this.props.isVisible && <div style={{position: "absolute", backgroundColor: "white", left: "0", top: "0", right: "0", bottom: "0", zIndex: "1"}}>
                
                {/* close button */}
                <span style={{position: "absolute", top:"45px", right:"45px"}} onClick = {() => {this.props.onClose && this.props.onClose()}} >X</span>
                
                {/* title */}
                <center><h2>Velg farge på vegg</h2></center>
               
                { this.props.sidings && this.props.sidings.map(
                    siding => {
                        
                        var isActiveSiding = (searchArgs.sidingId == siding.id);
                        var myColor = isActiveSiding ? "#009fe3" : "white";
                        var imageUrl = getRef(siding.diffuseMapRef, { url: true, size: 'original' });
						
                        return <a href={buildUrl({sidingId: siding.id})} onClick={() => this.onClose()}>
                            
                            <span style={{display: "inline-block", width: "200px", height: "200px", backgroundColor: myColor}}>
                                <center>
                                    <br/>
                                    <img src={imageUrl} style={{height: "100px"}}></img>
                                    <br/>
                                    {siding.name}
                                </center>
                            </span>
                        </a>;
                    })                    
                }
                
                
            </div> }
		</div>;
		
	}
	
}

import * as THREE from '../Functions/ThreeJs/ThreeJs.js';
import { OrbitControls } from '../Functions/ThreeJsUtils/OrbitCamera/OrbitCamera.js';
import modelCache from '../Functions/ModelCache/ModelCache.js';
import getRef from '../Functions/GetRef/GetRef.js';
import textureCache from '../Functions/TextureCache/TextureCache.js';

export default class TileViewer extends React.Component {

	constructor(props){
		super(props);
		this.state = {
		};
	}

	componentWillReceiveProps(props){
		this.loadModel(props);
	}

	loadModel(props){
		if(!this.props || !this.tile || props.tile != this.props.tile || props.colour != this.props.colour)
		{
			var modelUrl = getRef(props.tile.highDetailMeshRef, {url: true}); // The url to the HD mesh:
            
            var normalRef = props.colour.normalMapOverrideRef ? props.colour.normalMapOverrideRef : props.tile.normalMapRef;
            var normalUrl = getRef(normalRef, {url:true, size: 'original' });
            var metallicRef = props.colour.metallicRoughnessMapOverrideRef ? props.colour.metallicRoughnessMapOverrideRef : props.tile.metallicRoughnessMapRef;
            var metalicUrl = getRef(metallicRef, {url:true, size: 'original' });
            var diffuseUrl = getRef(props.colour.diffuseMapRef, {url:true, size: 'original' });
            
            textureCache(diffuseUrl).then(tex => {
                this.diffuseImage = tex;
                if(this.tileMaterial){
                    this.tileMaterial.map = tex;
                    this.tileMaterial.needsUpdate = true;
                    this.renderFrame();
                }
            });
            
            textureCache(metalicUrl).then(tex => {
                this.metalicImage = tex;
                if(this.tileMaterial){
                    this.tileMaterial.metalnessMap = tex;
					this.tileMaterial.roughnessMap = tex;
                    this.tileMaterial.needsUpdate = true;
                    this.renderFrame();
                }
            });
            
            textureCache(normalUrl).then(tex => {
                this.normalImage = tex;
                if(this.tileMaterial){
                    this.tileMaterial.normalMap = tex;
                    this.tileMaterial.needsUpdate = true;
                    this.renderFrame();
                }
            });    
            
			// Load it:
			modelCache(modelUrl).then(gltf => {

				if(this.tile){
					this.scene.remove(this.tile.scene);
				}

				this.tile = gltf;
                
                // Create roof tile material
                this.tileMaterial = new THREE.MeshStandardMaterial();
                this.tileMaterial.name = this.props.colour.name;
                if (this.diffuseImage) {
                    this.tileMaterial.map = this.diffuseImage;
                }
				
                if (this.metalicImage) {
                    this.tileMaterial.metalnessMap = this.metalicImage;
					this.tileMaterial.roughnessMap = this.metalicImage;
                }
				
                if (this.normalImage) {
                    this.tileMaterial.normalMap = this.normalImage;
                }
				
                this.tileMaterial.needsUpdate = true;
                gltf.scene.children[1].material = this.tileMaterial;                

				// Add to scene:
				this.scene.add( gltf.scene );

				// Redraw:
				this.renderFrame();

			})
		}
	}
    
	load(ref){
		if(this.loaded){
			return;
		}
		this.loaded = true;
		var container = ref;
		var camera, controls, scene, renderer;

		camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.25, 80 );
		camera.position.set( - 1.8, 7.5, 2.7 );
		scene = new THREE.Scene();
		this.scene = scene;

		var light = new THREE.PointLight( 0xffffff, 1, 100 );
		light.position.set( 1, 5, 1 );
		light.castShadow = true;
		scene.add( light );

		// Backlight. Secondary light which throws some light onto the underside.
		// This just has the job of providing some directional light in the shadows.
		
		var light = new THREE.PointLight( 0xffffff, 1, 100 );
		light.intensity = 0.8;
		light.position.set( -1, -5, -1 );
		scene.add( light );
		
		window.scene = scene;
		renderer = new THREE.WebGLRenderer( { antialias: true } );
		renderer.setClearColor("#fff", 1);
		renderer.setFaceCulling(false);
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( window.innerWidth, (window.innerHeight) );
		/*renderer.toneMapping = THREE.ACESFilmicToneMapping;
		renderer.toneMappingExposure = 1;*/
		renderer.outputEncoding = THREE.sRGBEncoding;
		container.appendChild( renderer.domElement );

		this.renderer = renderer;
		this.camera = camera;
		
		// Product owner suggestion - display tiles on a white background.
		textureCache('/content/whiteBackdrop.png').then(tex => {
			tex.mapping = THREE.EquirectangularReflectionMapping;
			tex.encoding = THREE.LinearEncoding;
			scene.background = tex;
			scene.environment = tex;
			
			// Backdrop has loaded - redraw now:
			this.renderFrame();
		});
		
		controls = new OrbitControls( camera, renderer.domElement );
		controls.addEventListener( 'change', () => this.renderFrame() ); // use if there is no animation loop
		controls.minDistance = 0.2;
		controls.maxDistance = 3;

		controls.target.set( 0, 0, 0 );
		controls.update();

		window.addEventListener( 'resize', () => this.onWindowResize(), false );

		this.renderFrame();

		this.loadModel(this.props);
	}

	onWindowResize() {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();

		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderFrame();
	}

	renderFrame(){
		this.renderer.render( this.scene, this.camera );
	}

	render(){

		return <div className="tile-viewer">
			<div ref={r => this.load(r)} />
		</div>;

	}

}

TileViewer.propTypes = {
};

import * as THREE from '../Functions/ThreeJs/ThreeJs.js';
import GLTFLoader from '../Functions/ThreeJsUtils/Gltf/Gltf.js';
import { OrbitControls } from '../Functions/ThreeJsUtils/OrbitCamera/OrbitCamera.js';
import tileSlice from '../Functions/TileSlice/TileSlice.js';
import modelCache from '../Functions/ModelCache/ModelCache.js';
import textureCache from '../Functions/TextureCache/TextureCache.js';
import getRef from '../Functions/GetRef/GetRef.js';
import roofSegmentGenerator from '../Functions/RoofSegmentGenerator/RoofSegmentGenerator.js';

export default class HouseViewer extends React.Component {

	constructor(props){
		super(props);
		this.state = {};
		this.onWindowResize = this.onWindowResize.bind(this);
	}
	
	componentDidMount(){
		this.load();
	}
	
	componentWillReceiveProps(props){
		this.loadModel(props);
	}

	loadModel(props){
		if(!this.ready)
		{
			return;
		}
		
		if(props.colour != this.state.colour){
			this.setState({
				colour: props.colour
			});
			this.loadHouse(props.colour, props.tile);
        }
		
		if(props.siding != this.state.siding){
			this.setState({
				siding: props.siding
			});
			this.loadSiding(props.siding);
		}
	}
	
	loadHouse(colour, tileInfo){
		console.log("Loading model");
		
        // Create roof tile material:
        var mat = new THREE.MeshStandardMaterial();
        mat.name = colour.name;
		
        var normalRef = colour.normalMapOverrideRef ? colour.normalMapOverrideRef : tileInfo.normalMapRef;
        var normalUrl = getRef(normalRef, {url:true, size: 'original' });
        var metallicRef = colour.metallicRoughnessMapOverrideRef ? colour.metallicRoughnessMapOverrideRef : tileInfo.metallicRoughnessMapRef;
        var metalicUrl = getRef(metallicRef, {url:true, size: 'original' });
        var diffuseUrl = getRef(colour.diffuseMapRef, {url:true, size: 'original' });
        
        textureCache(diffuseUrl).then(tex => {
			this.diffuseImage = tex;
            mat.map = tex;
			mat.needsUpdate = true;
			this.renderFrame();
		});
        
        textureCache(metalicUrl).then(tex => {
			this.metalicImage = tex;
			mat.metalnessMap = this.metalicImage;
			mat.roughnessMap = this.metalicImage;
			mat.needsUpdate = true;
			this.renderFrame();
		});
        
        textureCache(normalUrl).then(tex => {
			this.normalImage = tex;
			mat.normalMap = tex;
			mat.needsUpdate = true;
			this.renderFrame();
		});
		
		var tilePromise = modelCache(getRef(tileInfo.lowDetailMeshRef, {url: true}));
		var ridgePromise = tileInfo.ridgeRef ? modelCache(getRef(tileInfo.ridgeRef, {url: true})) : null;
		var ridgeEndPromise = tileInfo.ridgeEndRef ? modelCache(getRef(tileInfo.ridgeEndRef, {url: true})) : null;

		Promise.all([tilePromise, ridgePromise, ridgeEndPromise]).then(results => {

			// Find the meshes:
			var tileMesh = this.findMesh(results[0]);
			var ridgeMesh = results.length >= 2 && results[1] ? this.findMesh(results[1]) : null;
			var ridgeEndMesh = results.length >= 3 && results[2] ? this.findMesh(results[2]) : null;

			console.log("Generating roof..", results);

			// Generate the roof now:
			this.generateRoof(tileInfo, tileMesh, ridgeMesh, ridgeEndMesh, mat);
		});
	}

	/*
	* Finds the first threejs Mesh node in the given gltf
	*/
	findMesh(gltf){
		var result;

		gltf.scene.traverse(node => {
			if(!result && node && node.isMesh){
				result = node;
			}
		});

		return result;
	}

	generateRoof(tileInfo, tileMesh, ridgeMesh, ridgeEndMesh, material){
		var roofLayout = {
			ridges: [
				{
					length: 12.7,
					position: {
						x: -6.55, y: 6.95, z: 0.22
					},
					rotation: {
						x: 0, y: 1.57079, z: 0
					}
				}
			],
			segments: [
				{ // Largest one at the back
					minX: 0,
					maxX: 12.6,
					minZ: 0,
					maxZ: 5,
					position: {
						x: 6.1, y: 3.75, z: 4.65
					},
					rotation: {
						x: 0.627,
						y: 3.1415,
						z: 0
					}
				},
				{ // Front left
					minX: 0,
					maxX: 4.23,
					minZ: 0,
					maxZ: 5,
					position: {
						x: 1.9, y: 3.75, z: -4.2
					},
					rotation: {
						x: -0.627, y: 0,z: 0
					}
				},
				{ // Front right
					minX: 0,
					maxX: 4.23,
					minZ: 0,
					maxZ: 5,
					position: {
						x: -6.5, y: 3.75, z: -4.2
					},
					rotation: {
						x: -0.627, y: 0,z: 0
					}
				},
				{ // Front middle
					minX: 0,
					maxX: 5.08,
					minZ: 0,
					maxZ: 4.4,
					position: {
						x: -2.75, y: 5.4, z: -4.4
					},
					rotation: {
						x: -0.32, y: 0,z: 0
					}
				},
				{ // Smaller one at the back
					minX: 0,
					maxX: 4.3,
					minZ: 0,
					maxZ: 1.5,
					position: {
						x: 1.9, y: 2.55, z: 5.9
					},
					rotation: {
						x: 0.31,
						y: 3.1415,
						z: 0
					}
				}
			]
		};

		// The "segments" of the roof. These are rectangular segments of tiles.
		var segs = roofLayout.segments;

		if(this.roof){
			this.scene.remove(this.roof);
			this.roof = null;
		}

		var roof = new THREE.Group();

		for(var i=0;i<segs.length;i++){
			var seg = segs[i];

			var newRoofSeg = roofSegmentGenerator(
				new THREE.Box2(
					new THREE.Vector2(
						seg.minX,seg.minZ
					),
					new THREE.Vector2(
						seg.maxX,seg.maxZ
					),
				),
				tileMesh,
				tileInfo,
                material
			);

			newRoofSeg.position.x = seg.position.x;
			newRoofSeg.position.y = seg.position.y;
			newRoofSeg.position.z = seg.position.z;

			newRoofSeg.rotation.x = seg.rotation.x;
			newRoofSeg.rotation.y = seg.rotation.y;
			newRoofSeg.rotation.z = seg.rotation.z;
			roof.add(newRoofSeg);
		}

		if(ridgeMesh && roofLayout.ridges){
			// Generating the ridge(s) for this roof.
			var boundingBox = ridgeMesh.geometry.boundingBox;
			var minZOffset = boundingBox.min.z;
			var ridgeTileLength = boundingBox.max.z - minZOffset;
			var ridges = roofLayout.ridges;

			for(var i=0;i<ridges.length;i++){
				var ridge = ridges[i];
				var ridgeEndLength = 0;

				if(ridgeEndMesh != null){
					// Ridge ends are the 2 specialised tiles that go
					// at the ends of ridges to cap them off.
					boundingBox = ridgeEndMesh.geometry.boundingBox;
					ridgeEndLength = boundingBox.max.z - boundingBox.min.z;
				}

				var numberOfRidgeTiles = (ridge.length - (ridgeEndLength * 2)) / ridgeTileLength;
				var intNumberOfRidgeTiles = Math.floor(numberOfRidgeTiles);

				var ridgeInstance = new THREE.InstancedMesh(ridgeMesh.geometry.clone(), material, intNumberOfRidgeTiles);
				var placementHelper = new THREE.Object3D();

				var posZ = 0;

				if(ridgeEndMesh != null){
					// Ridge ends are the 2 specialised tiles that go
					// at the ends of ridges to cap them off.
					posZ += ridgeEndLength;

					var ends = new THREE.InstancedMesh(ridgeEndMesh.geometry.clone(), material, 2);

					// Offset along the axis by the min of the bounding box such that the min face
					// sits exactly at 0. This helps line up objects of varying length.
					placementHelper.position.set(0, -0.05, -boundingBox.min.z);
					placementHelper.rotation.y = Math.PI;
					placementHelper.updateMatrix();

					ends.setMatrixAt( 0, placementHelper.matrix );

					placementHelper.position.set(0, -0.05, ridge.length - ridgeEndLength - boundingBox.min.z);
					placementHelper.rotation.y = 0;
					placementHelper.updateMatrix();

					ends.setMatrixAt( 1, placementHelper.matrix );
					
					ridgeInstance.add(ends);
				}

				// The integer number of ridge tiles:
				for(var z=0;z<intNumberOfRidgeTiles;z++){
					placementHelper.position.set(0, 0, posZ - minZOffset);
					placementHelper.updateMatrix();

					ridgeInstance.setMatrixAt( z, placementHelper.matrix );

					posZ += ridgeTileLength;
				}

				// And finally a sliced tile to fill the little gap that remains:
				var remainingGap = (numberOfRidgeTiles - intNumberOfRidgeTiles) * ridgeTileLength;

				var ridgeGapTile = tileSlice(ridgeMesh.geometry, ridgeMesh.geometry.boundingBox.max.z - remainingGap, 'z', 'right');
				
				// Note: uses InstancedMesh because materials can't be shared between THREE.Mesh and THREE.InstancedMesh.
				// It has no particular performance downside.
				var ridgeGap = new THREE.InstancedMesh(ridgeGapTile, material, 1);
				placementHelper.position.set(0, 0, posZ - (ridgeTileLength - remainingGap) - minZOffset);
				placementHelper.updateMatrix();
				ridgeGap.setMatrixAt( 0, placementHelper.matrix );
				ridgeInstance.add(ridgeGap);
				
				ridgeInstance.position.x = ridge.position.x;
				ridgeInstance.position.y = ridge.position.y;
				ridgeInstance.position.z = ridge.position.z;

				ridgeInstance.rotation.x = ridge.rotation.x;
				ridgeInstance.rotation.y = ridge.rotation.y;
				ridgeInstance.rotation.z = ridge.rotation.z;
				roof.add(ridgeInstance);
			}
		}
        
		this.scene.add(roof);
		this.roof = roof;
		this.renderFrame();
	}

	loadSiding(siding){
        var imgUrl = getRef(siding.diffuseMapRef, { url: true, size: 'original' });
        
		textureCache(imgUrl).then(tex => {
			this.sidingImage = tex;
			
			if(this.walls){
				var prev = this.walls.material;
				var material = new THREE.MeshStandardMaterial();
				material.map = tex;
				material.requiresUpdate = true;
				material.aoMap = prev.aoMap;
				material.bumpMap = prev.bumpMap;
				material.normalMap = prev.normalMap;
				this.walls.material = material;
				this.renderFrame();
			}
		});
        
	}
	
	findMaterial(node, name){
		if(node.material && node.material.name == name){
			return node.material;
		}

		if(node.children){
			for(var i=0;i<node.children.length;i++){
				var cr = this.findMaterial(node.children[i], name);
				if(cr){
					return cr;
				}
			}
		}
	}

	load(){
		var camera, controls, scene, renderer;

		camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.25, 80 );

		// default position was obtained by moving the camera to a suitable spot and just grabbing the values:
		camera.position.set( -4.8511, 10.942, -10.438 );
		camera.rotation.x = -2.370;
		camera.rotation.y = -0.327;
		camera.rotation.z = -2.838;
		this.camera = camera;
		scene = new THREE.Scene();
		this.scene = scene;
		
		modelCache('/content/models/house/v2/Zara_house_FBX.glb').then(( gltf ) => {
			
			// Mark everything as shadow casting:
			gltf.scene.traverse( function( node ) {
				if ( node.isMesh ) {
					node.castShadow = true;
					node.receiveShadow = true;
				}
			});
/*
			// Delete the rough roof:
			var roughRoof = gltf.scene.getObjectByName("ROOF_METAL_ROUGH");
			roughRoof.parent.remove(roughRoof);
*/
			var grass = gltf.scene.getObjectByName("Grass");
			grass && grass.parent.remove(grass);
			grass = gltf.scene.getObjectByName("GRASS");
			grass && grass.parent.remove(grass);
			
			scene.add( gltf.scene );
			
			var walls = gltf.scene.getObjectByName("Zara_hus_FBX_03_walls");
			this.walls = walls;
			this.sidingMaterial = walls.material;
			
			/*
			if(this.sidingImage && this.sidingMaterial){
				this.sidingMaterial.map = this.sidingImage;
				this.sidingMaterial.needsUpdate = true;
				this.sidingMaterial.map.needsUpdate = true;
			}
			*/
			this.renderFrame();
            this.ready = true;
            this.loadModel(this.props);

		} );

		// Key light. Directional light is at the given position and looks at the origin. Health warning: Rotating it will do nothing!
		var light = new THREE.DirectionalLight( 0xffffff, 1 );
		light.position.set( -20, 20, -20 );
		light.castShadow = true;

		// Shadow cameras have to be explicitly configured. Use the "camera helper" below to get a visual of what the shadow cam looks like.
		light.shadow.mapSize.width = 2048;
		light.shadow.mapSize.height = 2048;
		light.shadow.camera.near = 0.5;
		light.shadow.camera.far = 60;
		light.shadow.camera.left = -10;
		light.shadow.camera.right = 10;
		light.shadow.camera.top = 10;
		light.shadow.camera.bottom = -10;
		light.shadowBias = -0.0005;
		scene.add( light );

		/*
		// Use this to visualise where the light is and what the above shadow camera numbers do
		var shadowHelper = new THREE.CameraHelper( light.shadow.camera );
		scene.add( shadowHelper );
		*/

		// Backlight. Secondary directional ambient light which acts as slight sky bounce.
		// This just has the job of providing some directional light in the shadows.
		light = new THREE.DirectionalLight( 0x4287f5, 0.5 );
		light.position.set( 83.5, 50.1, 75.3 );
		scene.add( light );

		// Fill light. This drives the colour of shadowed areas. Stacks with the environment map.
		var amb = new THREE.AmbientLight( 0x2f4352 ); // soft slightly blue light
		scene.add( amb );

		window.scene = scene;
		renderer = new THREE.WebGLRenderer( { antialias: true } );
		this.renderer = renderer;
		renderer.setClearColor("#fff", 1);
		renderer.setFaceCulling(false);
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( window.innerWidth, window.innerHeight );
			renderer.shadowMap.enabled = true;
			renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		// renderer.toneMapping = THREE.ACESFilmicToneMapping;
		// renderer.toneMappingExposure = 1;
		renderer.outputEncoding = THREE.sRGBEncoding;
		this.container.appendChild( renderer.domElement );
		
		textureCache('/content/whiteBackdrop.png').then(tex => { // '/content/HDRI_2k_8bit_graded.jpg' (field image)
			tex.mapping = THREE.EquirectangularReflectionMapping;
			scene.background = tex;
			scene.environment = tex;
		});
		
		controls = new OrbitControls( camera, renderer.domElement );
		controls.addEventListener( 'change', () => this.renderFrame() );
		controls.minDistance = 10;
		controls.maxDistance = 30;
		controls.maxPolarAngle = Math.PI / 2;
		
		controls.target.set( 0, 1, 0 );
		controls.update();

		window.addEventListener( 'resize', this.onWindowResize, false );

		this.renderFrame();

	}

	onWindowResize() {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();

		this.renderer.setSize( window.innerWidth, window.innerHeight);
		this.renderFrame();
	}

	renderFrame(){
		this.renderer.render( this.scene, this.camera );
	}

	render(){

		return <div className="house-viewer">
			<div ref={r => this.container = r} />
		</div>;

	}

}

HouseViewer.propTypes = {
};

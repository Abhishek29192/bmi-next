import * as THREE from '../ThreeJs/ThreeJs.js';

/*
* Downloads and caches images as loaded textures.
* Returns a promise which resolves as the texture object.
*/

var cache = {};

export default url => {
	
	if(cache[url]){
		return cache[url];
	}
	
	var promise = new Promise((success, reject) => {
		new THREE.TextureLoader().load(
			url,
			tex => {
				tex.encoding = THREE.sRGBEncoding;
				tex.wrapS = THREE.RepeatWrapping;
				tex.wrapT = THREE.RepeatWrapping;
				success(tex);
			}
		);
	});
	
	cache[url] = promise;
	return promise;
};
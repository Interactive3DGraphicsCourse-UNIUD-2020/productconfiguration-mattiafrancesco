import * as THREE from './build/three.module.js';

import * as Utils from './utils.js';

import {Group} from './Group.js';

import {Shader} from './Shader.js';

import {GUI} from './GUI.js'

import * as Model from  './Model.js'

var ANIMATION_DURATION = 4000*4;		//in milliseconds

class World
{
constructor()
{
	this.scene = new THREE.Scene();

	this.camera = new THREE.PerspectiveCamera(75, Utils.getRatio(), 0.1, 1000);	
	this.camera.position.set(0, 0, 10);

	/*
	//GUI
	this.gui = new GUI();

	//Animations
	this.startTime = Date.now();
	*/

	//Cube Map
	var loader = new THREE.CubeTextureLoader();
	let cityPath = 'textures/env/city/'
	let bridgePath = 'textures/env/Bridge2'
	loader.setPath( cityPath );

	var textureCube = loader.load( [
		'posx.jpg', 'negx.jpg',
		'posy.jpg', 'negy.jpg',
		'posz.jpg', 'negz.jpg'
	] );


	this.scene.background = textureCube;
	textureCube.minFilter = THREE.LinearMipMapLinearFilter;

	//init
	var uniforms;
	var fs;
	var vs;
	var materialExtensions;

	let pathTexturesBackCover = './textures/Back_Cover/'
	let pathGoldTexture = "Gold/TexturesCom_Paint_GoldFake_1K"

	var textureParameters = {
		material: pathGoldTexture,
		repeatS: 1.0,
		repeatT: 1.0,
	}

	var diffuseMap = this.loadTexture( pathTexturesBackCover + textureParameters.material + "_albedo.png" );
	var specularMap = this.loadTexture( pathTexturesBackCover + textureParameters.material + "_metallic.png" );
	var roughnessMap = this.loadTexture( pathTexturesBackCover + textureParameters.material + "_roughness.png" );

	let object = Model.load('./model/scene.gltf',10, (model) => {

		model.rotateX(90 * Math.PI / 180);
		model.translateZ(-10);
		model.translateY(-2);

		var meshes = model.children[0].children[0] // array di mesh
		meshes.children.forEach(obj => {
			console.log(obj);
			var testColor = 0XFF0000;
			var mesh = obj.children[0]
			switch (obj.name) {
				case "AntennaLines": //antenne attorno al telefono
					mesh.material = new THREE.MeshBasicMaterial({color: testColor});
					break
				case "AppleLogo":
					mesh.material = new THREE.MeshBasicMaterial({color: testColor});
					break
				case "BackCameraP1": //bordo nero attorno alle fotocamere, non copre le fotocamere (ha un buco dove sono le fotocamere)
				break
				case "BackCamerasCover001": //si posiziona sopra le fotocamere LE COPRE
					mesh.material = new THREE.MeshBasicMaterial({color: testColor});
					break
				case "BackCameraBottomGreyRing", "BackCameraTopGreyRing": //gli anelli neri delle fotocamere dietro
					mesh.material = new THREE.MeshBasicMaterial({color: testColor});
					break
				case "BackCameraBottomLens","BackCameraTopLens": //lenti fotocamere dietro
					mesh.material = new THREE.MeshBasicMaterial({color: testColor});
					break
				case "BackGlass": //vetro dietro iphone

					console.log(diffuseMap)
					console.log(specularMap)
					console.log(roughnessMap)

					uniforms = {
						specularMap: { type: "t", value: specularMap},
						diffuseMap:	{ type: "t", value: diffuseMap},
						roughnessMap:	{ type: "t", value: roughnessMap},
						pointLightPosition:	{ type: "v3", value: new THREE.Vector3( 7.0, 7.0, 7.0 ) },
						clight:	{ type: "v3", value: new THREE.Vector3(100,100,100) },
						textureRepeat: { type: "v2", value: new THREE.Vector2(textureParameters.repeatS,textureParameters.repeatT) }
					};

					vs = new Shader("back_cover_vert.glsl").getData();
					fs = new Shader("back_cover_frag.glsl").getData();

					mesh.material = new THREE.ShaderMaterial({ uniforms: uniforms, vertexShader: vs, fragmentShader: fs });
					mesh.material.needsUpdate = true;

				break
				case "Body": //tutto il bordo latere del telefono	

					materialExtensions = {
						derivatives: true, // set to use derivatives
						shaderTextureLOD: true // set to use shader texture LOD
					};

					var ciao = {
							cspec:	{ type: "v3", value: new THREE.Vector3(0.8,0.8,0.8) },
							envMap:	{ type: "t", value: textureCube},
							roughness: { type: "f", value: 0.2},
						};

					vs = new Shader("glossyRef_vert.glsl").getData();
					fs = new Shader("glossyRef_frag.glsl").getData();

					mesh.material = new THREE.ShaderMaterial({uniforms: ciao, vertexShader: vs, fragmentShader: fs ,extensions: materialExtensions });
					mesh.material.needsUpdate = true;

					break
				case "CameraBump": //la parte in rilievo che contiene le fotocamere dietro
					mesh.material = new THREE.MeshBasicMaterial({color: testColor});
					break
				case "CE": //logo CE dietro
					mesh.material = new THREE.MeshBasicMaterial({color: testColor});
					break
				case "EarphoneGrill": //griglia microfono davanti (sopra il notch)
					mesh.material = new THREE.MeshBasicMaterial({color: testColor});
					break
				case "FlashBG","FlashLED": //elementi che compongono il flash (elemento quadrato in mezzo alle due fotocamere dietro)
					mesh.material = new THREE.MeshBasicMaterial({color: testColor});
					break
				case "Front": //corpo davanti che circonda lo schermo
					mesh.material = new THREE.MeshBasicMaterial({color: testColor});
					break
				case "FrontCamera": //camera frontale
					mesh.material = new THREE.MeshBasicMaterial({color: testColor});
					break
				case "FrontGlass": //vetro dello schermo schermo
					break
				case "iPhoneLogoBack":
					mesh.material = new THREE.MeshBasicMaterial({color: testColor});
					break
				case "MuteSwitch","PowerButton":
					mesh.material = new THREE.MeshBasicMaterial({color: testColor});
					break
				case "Screen": //schermo ( si trova sotto il vetro "FrontGlass")
					mesh.material = new THREE.MeshBasicMaterial({color: testColor});
					break
				case "Screw": //non ho capito che roba è (è piccola e inutile trascurare)		N.B. screw = viti
					mesh.material = new THREE.MeshBasicMaterial({color: testColor});
					break
				case "SimSlot":
					mesh.material = new THREE.MeshBasicMaterial({color: testColor});
					break
				case "Text : Assembled in China", "Text: Designed By Apple in California":
					mesh.material = new THREE.MeshBasicMaterial({color: testColor});
					break
				case "VolumeButtons":
					mesh.material = new THREE.MeshBasicMaterial({color: testColor});
					break
			}

		});

		this.scene.add(model);
	},() => {});
}

loadTexture(file) {
	var texture = new THREE.TextureLoader().load( file , function ( texture ) {

		texture.minFilter = THREE.LinearMipMapLinearFilter;
		// texture.anisotropy = renderer.getMaxAnisotropy();
		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  		texture.offset.set( 0, 0 );
		texture.needsUpdate = true;
	} )
	return texture;
}

/*
	Define lights of scena
*/
initLights()
{
	//SunLight
	var sunLight = new THREE.DirectionalLight(0xFFFFFF, 0.5);
	//sunLight.castShadow = true;
	//sunLight.target.position.set(width/2, 0, depth/2);
	//sunLight.position.y = 50;
	//sunLight.shadow.camera.left = sunLight.shadow.camera.bottom = -50;
	//sunLight.shadow.camera.right = sunLight.shadow.camera.top = 50;
	this.scene.add(sunLight);

	//AmbientLight
	var ambientLight = new THREE.AmbientLight(0x999999);
	this.scene.add(ambientLight);
}

update()
{
	/*
	var currentSecond = (Date.now()-this.startTime);
	var amount = currentSecond/ANIMATION_DURATION;

	//Animation
	this.object.update(amount);
	*/
}
}

export {World};
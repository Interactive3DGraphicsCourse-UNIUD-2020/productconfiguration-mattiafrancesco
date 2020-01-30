import * as THREE from './build/three.module.js';
import * as THREEUTILITY from './build/BufferGeometryUtils.js';

import * as Utils from './utils.js';

import {Group} from './Group.js';

import {Shader} from './Shader.js';
import {ShaderParams} from './ShaderParams.js';
import * as ParamsNames from './References/ParamsNames.js';
import * as TextureNames from './References/TextureNames.js';
import * as MeshesNames from './References/MeshesNames.js';

import * as Model from  './Model.js'

class World
{
	constructor(anisotropy)
	{
		this.anisotropy = anisotropy;

		//Setup scene
		this.scene = new THREE.Scene();

		this.modelGroup = new Group();
		this.scene.add(this.modelGroup);

		this.camera = new THREE.PerspectiveCamera(75, Utils.getRatio(), 0.1, 1000);	
		this.camera.position.set(0, 0, 1);

		this.loader = new THREE.CubeTextureLoader();

		/*
		//GUI
		this.gui = new GUI();

		//Animations
		this.startTime = Date.now();
		*/

		//Load environment texture
		var cityPath = TextureNames.CITY_PATH
		//this.loader.setPath(cityPath);

		var textureCube = new this.loader.load([
		cityPath+'posx.jpg', cityPath+'negx.jpg',
		cityPath+'posy.jpg', cityPath+'negy.jpg',
		cityPath+'posz.jpg', cityPath+'negz.jpg'
		]);

		textureCube.minFilter = THREE.LinearMipMapLinearFilter;
		this.scene.background = textureCube;

		this.shaderParams = {}

		//init
		Model.load('./model/scene.gltf',10, (model) =>
		{
			console.log(model)
			try
			{
				model.rotateX(90 * Math.PI / 180);
				model.translateZ(-10);
				model.translateY(-2);

				var meshes = model.children[0].children[0].children; // array di mesh
				this.meshes = {};

				console.log("Nomi delle mesh")
				meshes.forEach(function(obj)
				{
					console.log(obj.name)
					var mesh = obj.children[0];
					this.meshes[obj.name] = mesh
					console.log(mesh)

					var testColor = 0X000000;
					var bufferGeometry = new THREE.BufferGeometry().fromGeometry(mesh.geometry);
					THREEUTILITY.THREE.BufferGeometryUtils.computeTangents(bufferGeometry);
					mesh.geometry = bufferGeometry;
					mesh.material = new THREE.MeshBasicMaterial({color: testColor});
				}.bind(this));

				this.initMeshes();

				this.modelGroup.add(model);
			}
			catch(e)
			{
				alert(e);
				console.log(e);
			}
		 },() => {});

		 console.log(this.scene);

	}

	loadTexture(file) {
		var texture = new THREE.TextureLoader().load( file , ( texture ) => {

			texture.minFilter = THREE.LinearMipMapLinearFilter;
			texture.anisotropy = this.anisotropy;
			texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	  		texture.offset.set( 0, 0 );
			texture.needsUpdate = true;

			//document.appendChild(texture.image.attributes[1].ownerElement);
		});// , () => {}, (e) => {alert(e); console.log(e);});
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

	initMeshes()
	{
		this.initGlossyMaterial();
		this.initBackGlass();
		this.initAppleLogo(); // ???????
		this.initDiffuseMaterial(); 
		this.initGlass();
		this.initScreen();
	}

	initAppleLogo() {
		var mesh = this.meshes[MeshesNames.MESH_LOGO_IPHONE];
		var mesh1 = this.meshes[MeshesNames.MESH_LOGO_APPLE];
		mesh.translateZ(4)
		mesh1.translateZ(4)

		// //Load maps
		// var pathTexturesBackCover = "textures/Back_Cover/";
		// var pathGoldTexture = "Gold/TexturesCom_Paint_GoldFake_1K";
		// var pathCarbonTexture = "Carbon/TexturesCom_Plastic_CarbonFiber_1K"

		// var textureParameters = {
		// 	material: pathCarbonTexture,
		// 	repeatS: 1.0,
		// 	repeatT: 1.0,
		// }

		// var diffuseMap = this.loadTexture(pathTexturesBackCover + textureParameters.material + "_albedo.png");
		// var specularMap = this.loadTexture(pathTexturesBackCover + textureParameters.material + "_metallic.png");
		// var roughnessMap = this.loadTexture(pathTexturesBackCover + textureParameters.material + "_roughness.png");

		// // console.log(pathTexturesBackCover + textureParameters.material + "_albedo.png")
		// // console.log(specularMap)
		// // console.log(roughnessMap)
		
		// var uniforms = {
		// 	diffuseMap:	{ type: "t", value: diffuseMap},
		// 	specularMap: { type: "t", value: specularMap},
		// 	roughnessMap:	{ type: "t", value: roughnessMap},
		// 	pointLightPosition:	{ type: "v3", value: new THREE.Vector3( 7.0, 7.0, 7.0 ) },
		// 	clight:	{ type: "v3", value: new THREE.Vector3(100,100,100) },
		// 	textureRepeat: { type: "v2", value: new THREE.Vector2(textureParameters.repeatS,textureParameters.repeatT) }
		// };

		// //Setup shaders
		// var shader = new Shader("back_cover");

		// var params = new ShaderParams(shader, uniforms);
		// params.addMesh(mesh);
	}

	initGlass() {
		var frontGlass = this.meshes[MeshesNames.MESH_GLASS_FRONT];
		//frontGlass.visible = false;

		var uniforms = {
			cspec:	{ type: "v3", value: new THREE.Vector3(1,1,1) },
			envMap:	{ type: "t", value: this.textureCube},
			alpha: { type: "f", value: 0.1}
		};

		var shader = new Shader("envLightReflect");

		var params = new ShaderParams(shader, uniforms, {}, true);
		params.addMesh(frontGlass);

		this.shaderParams[ParamsNames.PARAMS_ENV] = params;
	}

	initDiffuseMaterial() {
		this.initButtons()
		var meshFrontGrill = this.meshes[MeshesNames.MESH_EARPHONE_GRILL]

		var uniforms = {
			cdiff:	{ type: "v3", value: new THREE.Vector3(0.1,0.1,0.1) },
			irradianceMap:	{ type: "t", value: this.textureCube},
		};

		var shader = new Shader("diffuseRef");
		var params = new ShaderParams(shader, uniforms);

		params.addMesh(meshFrontGrill);
		this.shaderParams[ParamsNames.PARAMS_GRILL] = params;
	}

	//per forza color nero senza shader, il resto del bordo nero del telefono non è una mesh che possiamo modificare se 
	//personalizzassimo questa mesh si vedrebbe la differenza
	initFront() {
		var meshFront = this.meshes[MeshesNames.MESH_FRONT]
		meshFront.material = new THREE.MeshBasicMaterial({color: 0xFF0000});
	}

	initButtons() {
		var meshVolume = this.meshes[MeshesNames.MESH_BUTTONS_VOLUME];
		var meshPower = this.meshes[MeshesNames.MESH_BUTTON_POWER];
		var meshMute = this.meshes[MeshesNames.MESH_SWITCH_MUTE];

		var uniforms = {
			cdiff:	{ type: "v3", value: new THREE.Vector3(0.1,0.1,0.1) },
			irradianceMap:	{ type: "t", value: this.textureCube},
		};

		var shader = new Shader("diffuseRef");
		var params = new ShaderParams(shader, uniforms);

		params.addMesh(meshVolume);
		params.addMesh(meshPower);
		params.addMesh(meshMute);

		this.shaderParams[ParamsNames.PARAMS_BUTTONS] = params;
	}

	initGlossyMaterial()
	{
		var body = this.meshes[MeshesNames.MESH_BODY];
		var antennas = this.meshes[MeshesNames.MESH_ANTENNAS];
		var cameras_glass_up = this.meshes[MeshesNames.MESH_CAMERA_BACK_COVER];
		var cameras_body = this.meshes[MeshesNames.MESH_CAMERA_BACK_BUMP];

		//Setup shaders
		var shader = new Shader("glossyRef");

		var materialExtensions = {
			derivatives: true, // set to use derivatives
			shaderTextureLOD: true // set to use shader texture LOD
		};

		var uniforms1 = {
				cspec:	{ type: "v3", value: new THREE.Vector3(0.8,0.8,0.8) },
				envMap:	{ type: "t", value: this.textureCube},
				roughness: { type: "f", value: 0.2},
				alpha: {type: "f", value: 1}
			};
		var params1 = new ShaderParams(shader, uniforms1, materialExtensions);
		params1.addMesh(body);

		var uniforms2 = {
			cspec:	{ type: "v3", value: new THREE.Vector3(0.1,0.1,0.1) },
			envMap:	{ type: "t", value: this.textureCube},
			roughness: { type: "f", value: 0.2},
			alpha: {type: "f", value: 1}
		};
		var params2 = new ShaderParams(shader, uniforms2, materialExtensions);
		params2.addMesh(antennas);

		var uniforms3 = {
			cspec:	{ type: "v3", value: new THREE.Vector3(0.1,0.1,0.1) },
			envMap:	{ type: "t", value: this.textureCube},
			roughness: { type: "f", value: 0.2},
			alpha: {type: "f", value: 0.4}
		};
		var params3 = new ShaderParams(shader, uniforms3, materialExtensions);
		params3.material.transparent = true
		params3.addMesh(cameras_glass_up);

		var uniforms4 = {
			cspec:	{ type: "v3", value: new THREE.Vector3(0.1,0.1,0.1) },
			envMap:	{ type: "t", value: this.textureCube},
			roughness: { type: "f", value: 0.2},
			alpha: {type: "f", value: 1}
		};
		var params4 = new ShaderParams(shader, uniforms4, materialExtensions);
		params4.addMesh(cameras_body);


		this.shaderParams[ParamsNames.PARAMS_BODY] = params1;
		this.shaderParams[ParamsNames.PARAMS_ANTENNAS] = params2;
		this.shaderParams[ParamsNames.PARAMS_CAMERA_BACK_COVER] = params3;
		this.shaderParams[ParamsNames.PARAMS_CAMERA_BACK_BUMP] = params4;
	}

	initBackGlass()
	{
		var mesh = this.meshes[MeshesNames.MESH_GLASS_BACK];

		//Load maps
		var pathGoldTexture = TextureNames.GOLD_TEXTURE_PATH

		var textureParameters = {
			material: pathGoldTexture,
			repeatS: 1.0,
			repeatT: 1.0,
		}

		var diffuseMap = this.loadTexture(textureParameters.material + "_albedo.png");
		var specularMap = this.loadTexture(textureParameters.material + "_metallic.png");
		var roughnessMap = this.loadTexture(textureParameters.material + "_roughness.png");
		var normalMap = this.loadTexture(textureParameters.material + "_normal.png")

		// console.log(pathTexturesBackCover + textureParameters.material + "_albedo.png")
		// console.log(specularMap)
		// console.log(roughnessMap)
		
		var typeBackCover = TextureNames.TYPE_BACK_COVER.color 

		var uniforms = {
			neededTextures:{ type: "b", value: typeBackCover},
			diffuseMap:	{ type: "t", value: diffuseMap},
			specularMap: { type: "t", value: specularMap},
			roughnessMap:	{ type: "t", value: roughnessMap},
			pointLightPosition:	{ type: "v3", value: new THREE.Vector3( 7.0, 7.0, -20 ) },
			clight:	{ type: "v3", value: new THREE.Vector3(1,1,1) },
			textureRepeat: { type: "v2", value: new THREE.Vector2(textureParameters.repeatS,textureParameters.repeatT) }
		};

		//Setup shaders
		var shader = new Shader("back_cover");
		var params = new ShaderParams(shader, uniforms);
		params.addMesh(mesh);

		this.shaderParams[ParamsNames.PARAMS_BACK_GLASS] = params;
	}

	initScreen()
	{
		var mesh = this.meshes[MeshesNames.MESH_SCREEN];

		//Load maps
		var diffuseMap = this.loadTexture("textures/screen/IMG_0308.PNG");
				
		var uniforms = {
			diffuseMap:	{ type: "t", value: diffuseMap },
			show: { type: "f", value: 1 },
			brightness: { type: "f", value: 1 }
		};

		//Setup shaders
		var shader = new Shader("screen");
		var params = new ShaderParams(shader, uniforms);
		params.addMesh(mesh);

		this.shaderParams[ParamsNames.PARAMS_SCREEN] = params;
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
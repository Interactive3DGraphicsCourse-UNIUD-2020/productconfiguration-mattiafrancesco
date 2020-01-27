import * as THREE from './build/three.module.js';

import * as Utils from './utils.js';

import {Group} from './Group.js';

import {Shader} from './Shader.js';
import {ShaderParams} from './ShaderParams.js';

import * as MeshesNames from './MeshesNames.js';

import {GUI} from './GUI.js'

import * as Model from  './Model.js'

class World
{
	constructor()
	{
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
		var cityPath = 'textures/env/city/';
		//this.loader.setPath(cityPath);

		var textureCube = new this.loader.load([
		cityPath+'posx.jpg', cityPath+'negx.jpg',
		cityPath+'posy.jpg', cityPath+'negy.jpg',
		cityPath+'posz.jpg', cityPath+'negz.jpg'
		]);

		textureCube.minFilter = THREE.LinearMipMapLinearFilter;
		this.scene.background = textureCube;

		this.shaders = {}

		//init
		Model.load('./model/iphonetemp.gltf',10, (model) =>
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

					var testColor = 0XFF0000;

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
	}

	loadTexture(file) {
		var texture = new THREE.TextureLoader().load( file , function ( texture ) {

			texture.minFilter = THREE.LinearMipMapLinearFilter;
			// texture.anisotropy = renderer.getMaxAnisotropy();
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
		this.initButtons(); 
		this.initGlass()
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
		var frontGlass = this.meshes[MeshesNames.MESH_GLASS_FRONT]

		var uniforms = {
			cspec:	{ type: "v3", value: new THREE.Vector3(0.1,0.1,0.1) },
			envMap:	{ type: "t", value: this.textureCube},
			alpha: { type: "f", value: 0.3}
		};

		var shader = new Shader("envLightReflect");

		var params = new ShaderParams(shader, uniforms,true);
		this.shaders[MeshesNames.MESH_GLASS_FRONT] = params
		params.addMesh(frontGlass);
	}

	initButtons() {
		var meshVolume = this.meshes[MeshesNames.MESH_BUTTONS_VOLUME]
		var meshPower = this.meshes[MeshesNames.MESH_BUTTON_POWER]

		var uniforms = {
			cdiff:	{ type: "v3", value: new THREE.Vector3(0.1,0.1,0.1) },
			irradianceMap:	{ type: "t", value: this.textureCube},
		};

		var shader = new Shader("diffuseRef");

		var paramsForVolume = new ShaderParams(shader, uniforms);
		var paramsForButton = new ShaderParams(shader, uniforms);

		this.shaders[MeshesNames.MESH_BUTTONS_VOLUME] = paramsForVolume
		this.shaders[MeshesNames.MESH_BUTTON_POWER] = paramsForButton

		paramsForVolume.addMesh(meshVolume);
		paramsForButton.addMesh(meshPower);
	}

	initGlossyMaterial()
	{
		var body = this.meshes[MeshesNames.MESH_BODY];
		var antennas = this.meshes[MeshesNames.MESH_ANTENNAS]
		var cameras_glass_up = this.meshes[MeshesNames.MESH_CAMERA_BACK_COVER]
		var cameras_body = this.meshes[MeshesNames.MESH_CAMERA_BACK_BUMP]

		//Setup shaders
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

		var shader = new Shader("glossyRef");

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


		this.shaders[MeshesNames.MESH_BODY] = params1
		this.shaders[MeshesNames.MESH_ANTENNAS] = params2
		this.shaders[MeshesNames.MESH_CAMERA_BACK_COVER] = params3
		this.shaders[MeshesNames.MESH_CAMERA_BACK_BUMP] = params4
	}

	initBackGlass()
	{
		var mesh = this.meshes[MeshesNames.MESH_GLASS_BACK];

		//Load maps
		var pathTexturesBackCover = "textures/Back_Cover/";
		var pathGoldTexture = "Gold/TexturesCom_Paint_GoldFake_1K";
		var pathCarbonTexture = "Carbon/TexturesCom_Plastic_CarbonFiber_1K"

		var textureParameters = {
			material: pathCarbonTexture,
			repeatS: 1.0,
			repeatT: 1.0,
		}

		var diffuseMap = this.loadTexture(pathTexturesBackCover + textureParameters.material + "_albedo.png");
		var specularMap = this.loadTexture(pathTexturesBackCover + textureParameters.material + "_metallic.png");
		var roughnessMap = this.loadTexture(pathTexturesBackCover + textureParameters.material + "_roughness.png");

		// console.log(pathTexturesBackCover + textureParameters.material + "_albedo.png")
		// console.log(specularMap)
		// console.log(roughnessMap)
		
		var uniforms = {
			diffuseMap:	{ type: "t", value: diffuseMap},
			specularMap: { type: "t", value: specularMap},
			roughnessMap:	{ type: "t", value: roughnessMap},
			pointLightPosition:	{ type: "v3", value: new THREE.Vector3( 7.0, 7.0, 7.0 ) },
			clight:	{ type: "v3", value: new THREE.Vector3(100,100,100) },
			textureRepeat: { type: "v2", value: new THREE.Vector2(textureParameters.repeatS,textureParameters.repeatT) }
		};

		//Setup shaders
		var shader = new Shader("back_cover");
		var params = new ShaderParams(shader, uniforms);
		this.shaders[MeshesNames.MESH_GLASS_BACK] = params

		params.addMesh(mesh);
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
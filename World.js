import * as THREE from './build/three.module.js';

import * as Utils from './utils.js';

import {Group} from './Group.js';

import {Shader} from './Shader.js';
import {ShaderParams} from './ShaderParams.js';

import * as MeshesNames from './MeshesNames.js';

import {GUI} from './GUI.js'

import * as Model from  './Model.js'

var ANIMATION_DURATION = 4000*4;		//in milliseconds

class World
{
	constructor()
	{
		//Setup scene
		this.scene = new THREE.Scene();

		this.modelGroup = new Group();
		this.scene.add(this.modelGroup);

		this.camera = new THREE.PerspectiveCamera(75, Utils.getRatio(), 0.1, 1000);	
		this.camera.position.set(0, 0, 10);

		/*
		//GUI
		this.gui = new GUI();

		//Animations
		this.startTime = Date.now();
		*/

		this.loader = new THREE.CubeTextureLoader();

		//init
		Model.load('./model/scene.gltf',10, (model) =>
		{
			try
			{
				model.rotateX(90 * Math.PI / 180);
				model.translateZ(-10);
				model.translateY(-2);

				var meshes = model.children[0].children[0].children; // array di mesh
				this.meshes = {};

				meshes.forEach(function(obj)
				{
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
		var texture = this.loader.load( file , function ( texture ) {

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
		this.initBody();
		this.initBackGlass();
	}

	initBody()
	{
		var mesh = this.meshes[MeshesNames.MESH_BODY];
		console.log(this.meshes, mesh);

		//Load environment texture
		var cityPath = 'textures/env/city/'
		//this.loader.setPath(cityPath);

		var textureCube = this.loader.load([
			cityPath+'posx.jpg', cityPath+'negx.jpg',
			cityPath+'posy.jpg', cityPath+'negy.jpg',
			cityPath+'posz.jpg', cityPath+'negz.jpg'
		]);

		textureCube.minFilter = THREE.LinearMipMapLinearFilter;
		this.scene.background = textureCube;

		//Setup shaders
		var materialExtensions = {
			derivatives: true, // set to use derivatives
			shaderTextureLOD: true // set to use shader texture LOD
		};

		var uniforms = {
				cspec:	{ type: "v3", value: new THREE.Vector3(0.8,0.8,0.8) },
				envMap:	{ type: "t", value: textureCube},
				roughness: { type: "f", value: 0.2},
			};

		var shader = new Shader("glossyRef");

		var params = new ShaderParams(shader, uniforms, materialExtensions);
		params.addMesh(mesh);
	}

	initBackGlass()
	{
		var mesh = this.meshes[MeshesNames.MESH_GLASS_BACK];

		//Load maps
		var pathTexturesBackCover = "./textures/Back_Cover/";
		var pathGoldTexture = "Gold/TexturesCom_Paint_GoldFake_1K";

		var textureParameters = {
			material: pathGoldTexture,
			repeatS: 1.0,
			repeatT: 1.0,
		}

		var diffuseMap = this.loadTexture(pathTexturesBackCover + textureParameters.material + "_albedo.png");
		var specularMap = this.loadTexture(pathTexturesBackCover + textureParameters.material + "_metallic.png");
		var roughnessMap = this.loadTexture(pathTexturesBackCover + textureParameters.material + "_roughness.png");

		console.log(pathTexturesBackCover + textureParameters.material + "_albedo.png")
		console.log(specularMap)
		console.log(roughnessMap)

		var uniforms = {
			specularMap: { type: "t", value: specularMap},
			diffuseMap:	{ type: "t", value: diffuseMap},
			roughnessMap:	{ type: "t", value: roughnessMap},
			pointLightPosition:	{ type: "v3", value: new THREE.Vector3( 7.0, 7.0, 7.0 ) },
			clight:	{ type: "v3", value: new THREE.Vector3(100,100,100) },
			textureRepeat: { type: "v2", value: new THREE.Vector2(textureParameters.repeatS,textureParameters.repeatT) }
		};

		//Setup shaders
		var shader = new Shader("back_cover");

		var params = new ShaderParams(shader, uniforms);
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
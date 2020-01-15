import * as THREE from './build/three.module.js';

import * as Utils from './utils.js';

import {Group} from './Group.js';

import {Shader} from './Shader.js';
import {ShaderParams} from './ShaderParams.js';

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

		Model.load('./model/scene.gltf',10, (model) =>
		{
			try
			{
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
						/*
							var blackMetallicUniforms = {
								cspec:	{ type: "v3", value: new THREE.Vector3(0.9,0.9,0.9) },
								roughness: {type: "f", value: 0.5},
								pointLightPosition:	{ type: "v3", value: new THREE.Vector3() },
								clight:	{ type: "v3", value: new THREE.Vector3(
									0 ,
								0 ,
									0 ) },
							};

							vs = new Shader("shad_vert.glsl").getData();
							fs = new Shader("shad_frag.glsl").getData();
			
							var lightMesh = new THREE.Mesh( new THREE.SphereGeometry( 1, 16, 16),new THREE.MeshBasicMaterial ({color: 0xffff00, wireframe:true}));
							lightMesh.position.set( 7.0, 7.0, 7.0 );
							blackMetallicUniforms.pointLightPosition.value = new THREE.Vector3(lightMesh.position.x,lightMesh.position.y,lightMesh.position.z);
			
							ourMaterial = new THREE.ShaderMaterial({ uniforms: blackMetallicUniforms, vertexShader: vs, fragmentShader: fs });
							mesh.material = ourMaterial
						*/
							
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
							mesh.material = new THREE.MeshBasicMaterial({color: testColor});
							break
						case "Body": //tutto il bordo latere del telefono	

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

						this.params = new ShaderParams(shader, uniforms, materialExtensions);
						this.params.addMesh(mesh);

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
							//mesh.material = new THREE.MeshBasicMaterial({color: testColor})
							
							// var vs = new Shader("tmp_vert.glsl").getData();
							// var fs = new Shader("tmp_frag.glsl").getData();

							// console.log(vs, fs);

							// mesh.material = new THREE.ShaderMaterial({ vertexShader: vs, fragmentShader: fs });
							// mesh.material.needsUpdate = true;
							
							//var textureLoader = new THREE.TextureLoader();

							//var textureEquirec = textureLoader.load( "./textures/env/overwatch.jpg" );
							/*
							textureEquirec.mapping = THREE.EquirectangularReflectionMapping;
							textureEquirec.magFilter = THREE.LinearFilter;
							textureEquirec.minFilter = THREE.LinearMipmapLinearFilter;
							textureEquirec.encoding = THREE.sRGBEncoding;

							// Materials

							var equirectShader = THREE.ShaderLib[ "equirect" ];

							var equirectMaterial = new THREE.ShaderMaterial( {
								fragmentShader: equirectShader.fragmentShader,
								vertexShader: equirectShader.vertexShader,
								uniforms: equirectShader.uniforms,
								depthWrite: false,
								side: THREE.BackSide
							} );

							equirectMaterial.uniforms[ "tEquirect" ].value = textureEquirec;

							mesh.material = equirectMaterial;
							mesh.material.needsUpdate = true;
							*/
							//mesh.material = new THREE.MeshBasicMaterial({map: textureEquirec})
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
			}
			catch(e)
			{
				alert(e);
			}
		},() => {});
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
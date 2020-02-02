import * as THREE from './build/three.module.js';

import * as Utils from './utils.js';

import {Group} from './Group.js';

import {Shader} from './Shader.js';
import {ShaderParams} from './ShaderParams.js';
import * as Shaders from './References/ShadersNames.js';
import * as ParamsNames from './References/ParamsNames.js';
import * as TextureNames from './References/TextureNames.js';
import * as MeshesNames from './References/MeshesNames.js';

import * as Model from  './Model.js'

class World
{
	constructor(model, anisotropy)
	{
		this.anisotropy = anisotropy;

		//Setup scene
		this.scene = new THREE.Scene();

		this.modelGroup = new Group();
		this.scene.add(this.modelGroup);

		this.camera = new THREE.PerspectiveCamera(75, Utils.getRatio(), 0.1, 1000);	
		this.camera.position.set(0, 0, 1);

		this.loader = new THREE.CubeTextureLoader();

		//Init struct
		this.shaders = {};
		for(var shaderName of Shaders.shadersNames)
			this.shaders[shaderName] = new Shader(shaderName);
		/*	Saved all params for shaders
			access with ParamsName
		*/
		this.shaderParams = {}

		/*	Saved all textures
			Access with TexturesName
			Default Scena = City, Cover = Gold
		*/
		this.texturesLoaded = {}

		//Texture Envmap
		var self = this;
		var envMapToLoad = [TextureNames.CITY_PATH,TextureNames.BRIDGE_PATH]
		envMapToLoad.forEach( function(envPath){
			var textureCube = new self.loader.load([
				envPath+'posx.jpg', envPath+'negx.jpg',
				envPath+'posy.jpg', envPath+'negy.jpg',
				envPath+'posz.jpg', envPath+'negz.jpg'
				]);
			textureCube.minFilter = THREE.LinearMipMapLinearFilter;
			self.texturesLoaded[envPath] = textureCube
		} )
		
		console.log(this.texturesLoaded[TextureNames.CITY_PATH])
		//charge one envMap
		this.scene.background = this.texturesLoaded[TextureNames.CITY_PATH];

		//Texture cover
		var texturesToLoad = [TextureNames.GOLD_TEXTURE_PATH,TextureNames.CARBON_TEXTURE_PATH,TextureNames.METALGREEN_TEXTURE_PATH,TextureNames.SCIFI_TEXTURE_PATH]
		texturesToLoad.forEach( function(texturePath) {
			var specularMap = self.loadTexture(texturePath + "_albedo.png");
			var roughnessMap = self.loadTexture(texturePath + "_roughness.png");
			var normalMap = self.loadTexture(texturePath + "_normal.png")
			self.texturesLoaded[texturePath] = []
			self.texturesLoaded[texturePath][TextureNames.NORMAL_MAP] = normalMap
			self.texturesLoaded[texturePath][TextureNames.ROUGH_MAP] = roughnessMap
			self.texturesLoaded[texturePath][TextureNames.SPECULAR_MAP] = specularMap
		})

		//Mesh Model
		Model.load("./model/"+model, 10, (model) =>
		{
			try
			{

				var meshes = model.children[0].children[0].children; // array di mesh

				this.meshes = {};

				meshes.forEach( function(obj)
				{

					var mesh = obj.children[0];
					this.meshes[obj.name] = mesh

					//per sistemare i problemi del modello creato con blender
					if(obj.name == MeshesNames.MESH_CAMERA_BACK) {
						obj.rotation.x = 1.570821510773955
						obj.rotation.y = 0.010451478350490786
						obj.rotation.z = 1.5713388864561089
						obj.scale.x = 0.00000007
						obj.scale.y = 0.2026411197166064
						obj.scale.z = 0.4270733935753901
					}

					var testColor = 0X000000;
					mesh.material = new THREE.MeshBasicMaterial({color: testColor});
				}.bind(this));

				this.assignUVs(this.meshes[MeshesNames.MESH_GLASS_BACK].geometry)
				this.computeTangents(this.meshes[MeshesNames.MESH_GLASS_BACK].geometry)

				model.rotation.x = ( Math.PI / 180);
				model.translateZ(-10);
				model.translateY(-2);

				this.modelGroup.add(model);

				this.initMeshes();
			}
			catch(e)
			{
				alert(e);
				console.log(e);
			}
		 },() => {});

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

	assignUVs(geometry) {

		var uvs = [];
		var verticesAttr = geometry.getAttribute("position");
		var vertices = verticesAttr.array;

		for(var i=0;i<verticesAttr.count;i++)
		{
			/*
			verticesAttr.count = vertices.length/3 => i = face index
			we need just x and y so we take the first (i.e. [0]) and the second (i.e. [1]) items of each face
			*/
			var x = vertices[i*3+0];
			var y = vertices[i*3+1];

			//Here we scale the position making the uvs large as the width of the iPhone, then we add an offset to center the texture
			x = x * 1.0/5.0 + 1.0/2.0;
			y = y * 1.0/5.0 + 1.0/2.0;
			//In the y coordinate we can put 1.0/8.0 in place of 1.0/5.0 to streetch the texture and making it fit the back. With 1.0/5.0 we keep the texture ratio.

			uvs.push(x, y);
		}

		geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), 2));

		geometry.uvsNeedUpdate = true;
	}

	computeTangents( geometry ) {

		var index = geometry.index;
		var attributes = geometry.attributes;

		// based on http://www.terathon.com/code/tangent.html
		// (per vertex tangents)

		if ( index === null ||
			 attributes.position === undefined ||
			 attributes.normal === undefined ||
			 attributes.uv === undefined ) {

			console.warn( 'THREE.BufferGeometry: Missing required attributes (index, position, normal or uv) in BufferGeometry.computeTangents()' );
			return;

		}

		var indices = index.array;
		var positions = attributes.position.array;
		var normals = attributes.normal.array;
		var uvs = attributes.uv.array;

		var nVertices = positions.length / 3;

		if ( attributes.tangent === undefined ) {

			geometry.addAttribute( 'tangent', new THREE.BufferAttribute( new Float32Array( 4 * nVertices ), 4 ) );

		}

		var tangents = attributes.tangent.array;

		var tan1 = [], tan2 = [];

		for ( var i = 0; i < nVertices; i ++ ) {

			tan1[ i ] = new THREE.Vector3();
			tan2[ i ] = new THREE.Vector3();

		}

		var vA = new THREE.Vector3(),
			vB = new THREE.Vector3(),
			vC = new THREE.Vector3(),

			uvA = new THREE.Vector2(),
			uvB = new THREE.Vector2(),
			uvC = new THREE.Vector2(),

			sdir = new THREE.Vector3(),
			tdir = new THREE.Vector3();

		function handleTriangle( a, b, c ) {

			vA.fromArray( positions, a * 3 );
			vB.fromArray( positions, b * 3 );
			vC.fromArray( positions, c * 3 );

			uvA.fromArray( uvs, a * 2 );
			uvB.fromArray( uvs, b * 2 );
			uvC.fromArray( uvs, c * 2 );

			var x1 = vB.x - vA.x;
			var x2 = vC.x - vA.x;

			var y1 = vB.y - vA.y;
			var y2 = vC.y - vA.y;

			var z1 = vB.z - vA.z;
			var z2 = vC.z - vA.z;

			var s1 = uvB.x - uvA.x;
			var s2 = uvC.x - uvA.x;

			var t1 = uvB.y - uvA.y;
			var t2 = uvC.y - uvA.y;

			var r = 1.0 / ( s1 * t2 - s2 * t1 );

			sdir.set(
				( t2 * x1 - t1 * x2 ) * r,
				( t2 * y1 - t1 * y2 ) * r,
				( t2 * z1 - t1 * z2 ) * r
			);

			tdir.set(
				( s1 * x2 - s2 * x1 ) * r,
				( s1 * y2 - s2 * y1 ) * r,
				( s1 * z2 - s2 * z1 ) * r
			);

			tan1[ a ].add( sdir );
			tan1[ b ].add( sdir );
			tan1[ c ].add( sdir );

			tan2[ a ].add( tdir );
			tan2[ b ].add( tdir );
			tan2[ c ].add( tdir );

		}

		var groups = geometry.groups;

		if ( groups.length === 0 ) {

			groups = [ {
				start: 0,
				count: indices.length
			} ];

		}

		for ( var i = 0, il = groups.length; i < il; ++ i ) {

			var group = groups[ i ];

			var start = group.start;
			var count = group.count;

			for ( var j = start, jl = start + count; j < jl; j += 3 ) {

				handleTriangle(
					indices[ j + 0 ],
					indices[ j + 1 ],
					indices[ j + 2 ]
				);

			}

		}

		var tmp = new THREE.Vector3(), tmp2 = new THREE.Vector3();
		var n = new THREE.Vector3(), n2 = new THREE.Vector3();
		var w, t, test;

		function handleVertex( v ) {

			n.fromArray( normals, v * 3 );
			n2.copy( n );

			t = tan1[ v ];

			// Gram-Schmidt orthogonalize

			tmp.copy( t );
			tmp.sub( n.multiplyScalar( n.dot( t ) ) ).normalize();

			// Calculate handedness

			tmp2.crossVectors( n2, t );
			test = tmp2.dot( tan2[ v ] );
			w = ( test < 0.0 ) ? - 1.0 : 1.0;

			tangents[ v * 4 ] = tmp.x;
			tangents[ v * 4 + 1 ] = tmp.y;
			tangents[ v * 4 + 2 ] = tmp.z;
			tangents[ v * 4 + 3 ] = w;

		}

		for ( var i = 0, il = groups.length; i < il; ++ i ) {

			var group = groups[ i ];

			var start = group.start;
			var count = group.count;

			for ( var j = start, jl = start + count; j < jl; j += 3 ) {

				handleVertex( indices[ j + 0 ] );
				handleVertex( indices[ j + 1 ] );
				handleVertex( indices[ j + 2 ] );

			}

		}

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
		//var iphone = this.meshes[MeshesNames.MESH_LOGO_IPHONE];
		var apple = this.meshes[MeshesNames.MESH_LOGO_APPLE];

		var materialExtensions = {
			derivatives: true, // set to use derivatives
			shaderTextureLOD: true // set to use shader texture LOD
		};

		var uniforms = {
			cspec:	{ type: "v3", value: new THREE.Vector3(0.0) },
			envMap:	{ type: "t", value: this.texturesLoaded[TextureNames.CITY_PATH]},
			roughness: { type: "f", value: 0.2},
			alpha: {type: "f", value: 1}
		};

		var shader = this.shaders[Shaders.SHADER_GLOSSY_REF];
		var params = new ShaderParams(shader, uniforms, materialExtensions);

		params.addMesh(apple);

		this.shaderParams[ParamsNames.PARAMS_LOGOS] = params;

		apple.material.side = THREE.DoubleSide;
		apple.material.needsUpdate = true;
	}

	initGlass() {
		var frontGlass = this.meshes[MeshesNames.MESH_GLASS_FRONT];
		//frontGlass.visible = false;

		var uniforms = {
			cspec:	{ type: "v3", value: new THREE.Vector3(1,1,1) },
			envMap:	{ type: "t", value: this.texturesLoaded[TextureNames.CITY_PATH]},
			alpha: { type: "f", value: 0.1}
		};

		var shader = this.shaders[Shaders.SHADER_ENV_LIGHT];
		var params = new ShaderParams(shader, uniforms, {}, true);
		params.addMesh(frontGlass);

		this.shaderParams[ParamsNames.PARAMS_GLASS] = params;
	}

	initDiffuseMaterial() {
		this.initButtons()
		var meshFrontGrill = this.meshes[MeshesNames.MESH_EARPHONE_GRILL]

		var uniforms = {
			cdiff:	{ type: "v3", value: new THREE.Vector3(0.1,0.1,0.1) },
			envMap:	{ type: "t", value: this.texturesLoaded[TextureNames.CITY_PATH]},
		};

		var shader = this.shaders[Shaders.SHADER_DIFFUSE_REF];
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
			cdiff:	{ type: "v3", value: new THREE.Vector3(0,0,0) },
			envMap:	{ type: "t", value: this.texturesLoaded[TextureNames.CITY_PATH]},
		};

		var shader = this.shaders[Shaders.SHADER_DIFFUSE_REF];
		var params = new ShaderParams(shader, uniforms);

		params.addMesh(meshVolume);
		params.addMesh(meshPower);
		params.addMesh(meshMute);

		this.shaderParams[ParamsNames.PARAMS_BUTTONS] = params;
	}

	initGlossyMaterial()
	{

		var body = this.meshes[MeshesNames.MESH_BODY];
		var simSlot = this.meshes[MeshesNames.MESH_SIM_SLOT];
		var antennas = this.meshes[MeshesNames.MESH_ANTENNAS];
		var cameras_glass_up = this.meshes[MeshesNames.MESH_CAMERA_BACK_COVER];
		var cameras_body = this.meshes[MeshesNames.MESH_CAMERA_BACK_BUMP];
		var coverCamera = this.meshes[MeshesNames.MESH_CAMERA_BACK]

		//Setup shaders
		var shader = this.shaders[Shaders.SHADER_GLOSSY_REF];

		var materialExtensions = {
			derivatives: true, // set to use derivatives
			shaderTextureLOD: true // set to use shader texture LOD
		};

		var uniforms1 = {
				cspec:	{ type: "v3", value: new THREE.Vector3(0.8,0.8,0.8) },
				envMap:	{ type: "t", value: this.texturesLoaded[TextureNames.CITY_PATH]},
				roughness: { type: "f", value: 0.2},
				alpha: {type: "f", value: 1}
			};
		var params1 = new ShaderParams(shader, uniforms1, materialExtensions);
		params1.addMesh(body);

		var uniforms2 = {
			cspec:	{ type: "v3", value: new THREE.Vector3(0.1,0.1,0.1) },
			envMap:	{ type: "t", value: this.texturesLoaded[TextureNames.CITY_PATH]},
			roughness: { type: "f", value: 0.2},
			alpha: {type: "f", value: 1}
		};
		var params2 = new ShaderParams(shader, uniforms2, materialExtensions);
		params2.addMesh(simSlot);
		params2.addMesh(antennas);

		var uniforms3 = {
			cspec:	{ type: "v3", value: new THREE.Vector3(0.1,0.1,0.1) },
			envMap:	{ type: "t", value: this.texturesLoaded[TextureNames.CITY_PATH]},
			roughness: { type: "f", value: 0.2},
			alpha: {type: "f", value: 0.4}
		};
		var params3 = new ShaderParams(shader, uniforms3, materialExtensions);
		params3.material.transparent = true
		params3.addMesh(cameras_glass_up);

		var uniforms4 = {
			cspec:	{ type: "v3", value: new THREE.Vector3(0.1,0.1,0.1)},
			envMap:	{ type: "t", value: this.texturesLoaded[TextureNames.CITY_PATH]},
			roughness: { type: "f", value: 0.2},
			alpha: {type: "f", value: 1}
		};
		var params4 = new ShaderParams(shader, uniforms4, materialExtensions);
		params4.addMesh(cameras_body);

		var uniforms5 = {
			cspec:	{ type: "v3", value: new THREE.Vector3(0.01,0.01,0.01) },
			envMap:	{ type: "t", value: this.texturesLoaded[TextureNames.CITY_PATH]},
			roughness: { type: "f", value: 0.7},
			alpha: {type: "f", value: 1}
		};
		var params5 = new ShaderParams(shader, uniforms5, materialExtensions);
		params5.addMesh(coverCamera);

		this.shaderParams[ParamsNames.PARAMS_BODY] = params1;
		this.shaderParams[ParamsNames.PARAMS_ANTENNAS] = params2;
		this.shaderParams[ParamsNames.PARAMS_CAMERA_BACK_COVER] = params3;
		this.shaderParams[ParamsNames.PARAMS_CAMERA_BACK_BUMP] = params4;
	}

	initBackGlass()
	{
		var mesh = this.meshes[MeshesNames.MESH_GLASS_BACK];


		var textureParameters = {
			repeatS: 1.0,
			repeatT: 1.0,
		}

		console.log(TextureNames.TYPE_BACK_COVER.color)

		var uniforms = {
			cspecColor: { type: "v3", value: new THREE.Vector3(0.8,0.8,0.8) },
			roughnessColor: {type: "f", value: 0.2 },
			envMap: { type: "t", value: this.texturesLoaded[TextureNames.CITY_PATH]},
			normalMap: { type: "t", value: this.texturesLoaded[TextureNames.GOLD_TEXTURE_PATH][ParamsNames.NORMAL_MAP]},
			neededTextures:{ type: "b", value: TextureNames.TYPE_BACK_COVER.color },
			specularMap: { type: "t", value: this.texturesLoaded[TextureNames.GOLD_TEXTURE_PATH][ParamsNames.SPECULAR_MAP]},
			roughnessMap:	{ type: "t", value: this.texturesLoaded[TextureNames.GOLD_TEXTURE_PATH][ParamsNames.ROUGH_MAP]},
			textureRepeat: { type: "v2", value: new THREE.Vector2(textureParameters.repeatS,textureParameters.repeatT) }
		};

		//Setup shaders
		var materialExtensions = {
			shaderTextureLOD: true // set to use shader texture LOD
		};
		var shader = new Shader("back_cover");
		var params = new ShaderParams(shader, uniforms,materialExtensions);
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
		var shader = this.shaders[Shaders.SHADER_SCREEN];
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
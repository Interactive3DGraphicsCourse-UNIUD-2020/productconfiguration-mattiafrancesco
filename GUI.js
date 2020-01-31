import {Menu} from './Menu.js';
import * as THREE from '../build/three.module.js';

import * as ParamsNames from './References/ParamsNames.js';
import * as ColorNames from './References/ColorNames.js';
import * as TextureNames from './References/TextureNames.js';

class GUI
{
	constructor(htmlContainerID, params,scene)
	{
		var htmlContainer = $("#"+htmlContainerID);

		this.menu = new Menu(htmlContainer);
		
		var environmentMenu = this.menu.addMenu("Environment");
		environmentMenu.addItem("City", () => { 
			var loader = new THREE.CubeTextureLoader();
			//Load environment texture
			var cityPath = TextureNames.CITY_PATH
			//this.loader.setPath(cityPath);

			var textureCube = new loader.load([
				cityPath+'posx.jpg', cityPath+'negx.jpg',
				cityPath+'posy.jpg', cityPath+'negy.jpg',
				cityPath+'posz.jpg', cityPath+'negz.jpg'
			]);

			textureCube.minFilter = THREE.LinearMipMapLinearFilter;
			scene.background = textureCube;
			params[ParamsNames.ENV_MAP] = textureCube
			this.refreshEnvMap(params)

		});
		environmentMenu.addItem("Bridge", () => {

			var loader = new THREE.CubeTextureLoader();

			//Load environment texture
			var bridgePath = TextureNames.BRIDGE_PATH
			//this.loader.setPath(cityPath);

			var textureCube = new loader.load([
				bridgePath+'posx.jpg', bridgePath+'negx.jpg',
				bridgePath+'posy.jpg', bridgePath+'negy.jpg',
				bridgePath+'posz.jpg', bridgePath+'negz.jpg'
			]);

			textureCube.minFilter = THREE.LinearMipMapLinearFilter;
			scene.background = textureCube;
			params[ParamsNames.ENV_MAP] = textureCube
			this.refreshEnvMap(params)

		 });


		var antennasMenu = this.menu.addMenu("Antennas");
		antennasMenu.addItem("Red", () => { params[ParamsNames.PARAMS_ANTENNAS].set("cspec", ColorNames.RED); });
		antennasMenu.addItem("Green", () => { params[ParamsNames.PARAMS_ANTENNAS].set("cspec", ColorNames.GREEN); });
		antennasMenu.addItem("Blue", () => { params[ParamsNames.PARAMS_ANTENNAS].set("cspec", ColorNames.BLUE); });

		var buttonsMenu = this.menu.addMenu("Buttons")
		buttonsMenu.addItem("Red", () => { params[ParamsNames.PARAMS_BUTTONS].set("cdiff", ColorNames.RED); })
		buttonsMenu.addItem("Green", () => { params[ParamsNames.PARAMS_BUTTONS].set("cdiff", ColorNames.GREEN); })
		buttonsMenu.addItem("Blue", () => { params[ParamsNames.PARAMS_BUTTONS].set("cdiff", ColorNames.BLUE); })

		// var logoMenu = this.menu.addMenu("Logo");
		// logoMenu.addItem("Smooth");
		// logoMenu.addItem("Rough");

		var bodyMenu = this.menu.addMenu("Body");
		bodyMenu.addItem("Red", () => { params[ParamsNames.PARAMS_BODY].set("cspec",ColorNames.RED); })
		bodyMenu.addItem("Yellow", () => { params[ParamsNames.PARAMS_BODY].set("cspec",ColorNames.YELLOW); });
		bodyMenu.addItem("Silver", () => { params[ParamsNames.PARAMS_BODY].set("cspec",ColorNames.SILVER); });
		bodyMenu.addItem("Violet", () => { params[ParamsNames.PARAMS_BODY].set("cspec",ColorNames.VIOLET); });

		var coverMenu = this.menu.addMenu("Cover");
		coverMenu.addItem("Gold", () => { this.loadNewTexture(TextureNames.GOLD_TEXTURE_PATH,params) })
		coverMenu.addItem("Carbon", () => { this.loadNewTexture(TextureNames.CARBON_TEXTURE_PATH,params) });
		
		 var screenMenu = this.menu.addMenu("Screen");
		screenMenu.addItem("On", () => { params[ParamsNames.PARAMS_SCREEN].set("show", 1); });
		screenMenu.addItem("Off", () => { params[ParamsNames.PARAMS_SCREEN].set("show", 0); });
		
		var maxBrightness = 7;
		var brightnessMenu = screenMenu.addMenu("Brightness");
		for(let i=1;i<=maxBrightness;i++)
			brightnessMenu.addItem(i, () => { params[ParamsNames.PARAMS_SCREEN].set("brightness", i*0.4/(maxBrightness-2)+0.6); });
	}

	refreshEnvMap(params) {
		var meshesParamsNameWithEnvMap = [ParamsNames.PARAMS_ENV,ParamsNames.PARAMS_GRILL,ParamsNames.PARAMS_BUTTONS,ParamsNames.PARAMS_BODY,ParamsNames.PARAMS_ANTENNAS,ParamsNames.PARAMS_CAMERA_BACK_COVER,ParamsNames.PARAMS_CAMERA_BACK_BUMP,ParamsNames.PARAMS_BACK_GLASS]
		meshesParamsNameWithEnvMap.forEach( function(paramName){
			params[paramName].set("envMap",params[ParamsNames.ENV_MAP])
		})
	}

	loadNewTexture(pathTexture,params){
		var textureParameters = {
			material: pathTexture,
			repeatS: 1.0,
			repeatT: 1.0,
		}

		var diffuseMap = this.loadTexture(textureParameters.material + "_albedo.png");
		var specularMap = this.loadTexture(textureParameters.material + "_metallic.png");
		var roughnessMap = this.loadTexture(textureParameters.material + "_roughness.png");
		var normalMap = this.loadTexture(textureParameters.material + "_normal.png")
		
		params[ParamsNames.PARAMS_BACK_GLASS].set("normalMap", normalMap)
		params[ParamsNames.PARAMS_BACK_GLASS].set("specularMap", specularMap)
		params[ParamsNames.PARAMS_BACK_GLASS].set("roughnessMap", roughnessMap)
		params[ParamsNames.PARAMS_BACK_GLASS].set("diffuseMap", diffuseMap)
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
}

export {GUI};
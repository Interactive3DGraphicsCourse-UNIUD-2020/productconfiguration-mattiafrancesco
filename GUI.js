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
		antennasMenu.addItem("Black", () => { params[ParamsNames.PARAMS_ANTENNAS].set("cspec", ColorNames.BLACK); });
		antennasMenu.addItem("Red", () => { params[ParamsNames.PARAMS_ANTENNAS].set("cspec", ColorNames.RED); });
		antennasMenu.addItem("Yellow", () => { params[ParamsNames.PARAMS_ANTENNAS].set("cspec", ColorNames.YELLOW); });
		antennasMenu.addItem("Silver", () => { params[ParamsNames.PARAMS_ANTENNAS].set("cspec", ColorNames.SILVER); });
		antennasMenu.addItem("Green", () => { params[ParamsNames.PARAMS_ANTENNAS].set("cspec", ColorNames.GREEN); });
		antennasMenu.addItem("Blue", () => { params[ParamsNames.PARAMS_ANTENNAS].set("cspec", ColorNames.BLUE); });
		antennasMenu.addItem("Violet", () => { params[ParamsNames.PARAMS_ANTENNAS].set("cspec", ColorNames.VIOLET); });

		var buttonsMenu = this.menu.addMenu("Buttons")
		buttonsMenu.addItem("Black", () => { params[ParamsNames.PARAMS_BUTTONS].set("cdiff", ColorNames.BLACK); })
		buttonsMenu.addItem("Red", () => { params[ParamsNames.PARAMS_BUTTONS].set("cdiff", ColorNames.RED); })
		buttonsMenu.addItem("Yellow", () => { params[ParamsNames.PARAMS_BUTTONS].set("cdiff",ColorNames.YELLOW); });
		buttonsMenu.addItem("Violet", () => { params[ParamsNames.PARAMS_BUTTONS].set("cdiff", ColorNames.SILVER); })
		buttonsMenu.addItem("Green", () => { params[ParamsNames.PARAMS_BUTTONS].set("cdiff", ColorNames.GREEN); })
		buttonsMenu.addItem("Blue", () => { params[ParamsNames.PARAMS_BUTTONS].set("cdiff", ColorNames.BLUE); })
		buttonsMenu.addItem("Violet", () => { params[ParamsNames.PARAMS_BUTTONS].set("cdiff", ColorNames.VIOLET); })


		var logoMenu = this.menu.addMenu("Logo");
		logoMenu.addItem("Smooth", () => { params[ParamsNames.PARAMS_LOGOS].set("roughness", 0.2);} );
		logoMenu.addItem("Rough", () => { params[ParamsNames.PARAMS_LOGOS].set("roughness", 0.8);} );

		var bodyMenu = this.menu.addMenu("Body");
		bodyMenu.addItem("Black", () => { params[ParamsNames.PARAMS_BODY].set("cspec",ColorNames.BLACK); })
		bodyMenu.addItem("Red", () => { params[ParamsNames.PARAMS_BODY].set("cspec",ColorNames.RED); })
		bodyMenu.addItem("Yellow", () => { params[ParamsNames.PARAMS_BODY].set("cspec",ColorNames.YELLOW); });
		bodyMenu.addItem("Silver", () => { params[ParamsNames.PARAMS_BODY].set("cspec",ColorNames.SILVER); });
		bodyMenu.addItem("Green", () => { params[ParamsNames.PARAMS_BODY].set("cspec",ColorNames.GREEN); });
		bodyMenu.addItem("Blue", () => { params[ParamsNames.PARAMS_BODY].set("cspec", ColorNames.BLUE); })
		bodyMenu.addItem("Violet", () => { params[ParamsNames.PARAMS_BODY].set("cspec",ColorNames.VIOLET); });		


		var coverMenu = this.menu.addMenu("Cover");
		coverMenu.addItem("Black", () => { this.setNewColor(ColorNames.BLACK,params) })
		coverMenu.addItem("Red", () => { this.setNewColor(ColorNames.RED,params) })
		coverMenu.addItem("Yellow", () => { this.setNewColor(ColorNames.YELLOW,params) })
		coverMenu.addItem("Silver", () => { this.setNewColor(ColorNames.SILVER,params) })
		coverMenu.addItem("Blue", () => { this.setNewColor(ColorNames.BLUE,params) })
		coverMenu.addItem("Violet", () => { this.setNewColor(ColorNames.VIOLET,params) });

		coverMenu.addItem("Gold", () => { this.setNewTexture(TextureNames.GOLD_TEXTURE_PATH,params) })
		coverMenu.addItem("Carbon", () => { this.setNewTexture(TextureNames.CARBON_TEXTURE_PATH,params) });
		coverMenu.addItem("MetalGreen", () => { this.setNewTexture(TextureNames.METALGREEN_TEXTURE_PATH,params) });
		coverMenu.addItem("Sci-Fi", () => { this.setNewTexture(TextureNames.SCIFI_TEXTURE_PATH,params) });

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

	setNewTexture(pathTexture,params){
		params[ParamsNames.PARAMS_BACK_GLASS].set("neededTextures", TextureNames.TYPE_BACK_COVER.texture)
		params[ParamsNames.PARAMS_BACK_GLASS].set("normalMap", params[pathTexture][ParamsNames.NORMAL_MAP])
		params[ParamsNames.PARAMS_BACK_GLASS].set("specularMap", params[pathTexture][ParamsNames.SPECULAR_MAP])
		params[ParamsNames.PARAMS_BACK_GLASS].set("roughnessMap", params[pathTexture][ParamsNames.ROUGH_MAP])
	}

	setNewColor(color,params) {
		params[ParamsNames.PARAMS_BACK_GLASS].set("neededTextures", TextureNames.TYPE_BACK_COVER.color)
		params[ParamsNames.PARAMS_BACK_GLASS].set("cspecColor",color)
	}


}

export {GUI};
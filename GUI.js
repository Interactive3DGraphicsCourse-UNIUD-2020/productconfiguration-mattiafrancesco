import {Menu} from './Menu.js';

import * as ParamsNames from './References/ParamsNames.js';
import * as ColorNames from './References/ColorNames.js';
import * as TextureNames from './References/TextureNames.js';

class GUI
{
	constructor(htmlContainerID, params,scene,textures)
	{
		var htmlContainer = $("#"+htmlContainerID);

		this.menu = new Menu(htmlContainer);
		
		var environmentMenu = this.menu.addMenu("Environment");
		environmentMenu.addItem("City", () => {
			scene.background = textures[TextureNames.CITY_PATH];
			this.refreshEnvMap(params,textures[TextureNames.CITY_PATH])
		});
		environmentMenu.addItem("Bridge", () => {
			scene.background = textures[TextureNames.BRIDGE_PATH]
			this.refreshEnvMap(params,textures[TextureNames.BRIDGE_PATH])
		 });


		var antennasMenu = this.menu.addMenu("Antennas");
		antennasMenu.addItem("Black", () => { params[ParamsNames.PARAMS_ANTENNAS].set("cspec", ColorNames.BLACK); });
		antennasMenu.addItem("Red", () => { params[ParamsNames.PARAMS_ANTENNAS].set("cspec", ColorNames.RED); });
		antennasMenu.addItem("Yellow", () => { params[ParamsNames.PARAMS_ANTENNAS].set("cspec", ColorNames.YELLOW); });
		antennasMenu.addItem("Silver", () => { params[ParamsNames.PARAMS_ANTENNAS].set("cspec", ColorNames.SILVER); });
		
		antennasMenu.addItem("Green", () => { params[ParamsNames.PARAMS_ANTENNAS].set("cspec", ColorNames.GREEN); });
		antennasMenu.addItem("Gold", () => { params[ParamsNames.PARAMS_ANTENNAS].set("cspec", ColorNames.GOLD); });

		var buttonsMenu = this.menu.addMenu("Buttons")
		buttonsMenu.addItem("Black", () => { params[ParamsNames.PARAMS_BUTTONS].set("cdiff", ColorNames.BLACK); })
		buttonsMenu.addItem("Red", () => { params[ParamsNames.PARAMS_BUTTONS].set("cdiff", ColorNames.RED); })
		buttonsMenu.addItem("Yellow", () => { params[ParamsNames.PARAMS_BUTTONS].set("cdiff",ColorNames.YELLOW); });
		buttonsMenu.addItem("Silver", () => { params[ParamsNames.PARAMS_BUTTONS].set("cdiff", ColorNames.SILVER); })
		
		buttonsMenu.addItem("Green", () => { params[ParamsNames.PARAMS_BUTTONS].set("cdiff", ColorNames.GREEN); })
		buttonsMenu.addItem("Gold", () => { params[ParamsNames.PARAMS_BUTTONS].set("cdiff", ColorNames.GOLD); })

		var logoMenu = this.menu.addMenu("Logo");
		logoMenu.addItem("Smooth", () => { params[ParamsNames.PARAMS_LOGOS].set("roughness", 0.2);} );
		logoMenu.addItem("Rough", () => { params[ParamsNames.PARAMS_LOGOS].set("roughness", 0.8);} );

		var bodyMenu = this.menu.addMenu("Body");
		bodyMenu.addItem("Black", () => { params[ParamsNames.PARAMS_BODY].set("cspec",ColorNames.BLACK); })
		bodyMenu.addItem("Red", () => { params[ParamsNames.PARAMS_BODY].set("cspec",ColorNames.RED); })
		bodyMenu.addItem("Yellow", () => { params[ParamsNames.PARAMS_BODY].set("cspec",ColorNames.YELLOW); });
		bodyMenu.addItem("Silver", () => { params[ParamsNames.PARAMS_BODY].set("cspec",ColorNames.SILVER); });
		
		bodyMenu.addItem("Green", () => { params[ParamsNames.PARAMS_BODY].set("cspec",ColorNames.GREEN); });
		bodyMenu.addItem("Gold", () => { params[ParamsNames.PARAMS_BODY].set("cspec",ColorNames.GOLD); });


		var coverMenu = this.menu.addMenu("Cover");
		coverMenu.addItem("Black", () => { this.setNewColor(ColorNames.BLACK,params) })
		coverMenu.addItem("Red", () => { this.setNewColor(ColorNames.RED,params) })
		coverMenu.addItem("Yellow", () => { this.setNewColor(ColorNames.YELLOW,params) })
		coverMenu.addItem("Silver", () => { this.setNewColor(ColorNames.SILVER,params) })
		
		coverMenu.addItem("Gold", () => { this.setNewTexture(TextureNames.GOLD_TEXTURE_PATH,params,textures) })
		coverMenu.addItem("Carbon", () => { this.setNewTexture(TextureNames.CARBON_TEXTURE_PATH,params,textures) });
		coverMenu.addItem("MetalGreen", () => { this.setNewTexture(TextureNames.METALGREEN_TEXTURE_PATH,params,textures) });
		coverMenu.addItem("Sci-Fi", () => { this.setNewTexture(TextureNames.SCIFI_TEXTURE_PATH,params,textures) });

		var screenMenu = this.menu.addMenu("Screen");
		screenMenu.addItem("On", () => { params[ParamsNames.PARAMS_SCREEN].set("show", 1); });
		screenMenu.addItem("Off", () => { params[ParamsNames.PARAMS_SCREEN].set("show", 0); });
		
		var maxBrightness = 7;
		var brightnessMenu = screenMenu.addMenu("Brightness");
		for(let i=1;i<=maxBrightness;i++)
			brightnessMenu.addItem(i, () => { params[ParamsNames.PARAMS_SCREEN].set("brightness", i*0.4/(maxBrightness-2)+0.6); });
	}

	refreshEnvMap(params,envMap) {
		var meshesParamsNameWithEnvMap = [ParamsNames.PARAMS_GLASS,ParamsNames.PARAMS_GRILL,ParamsNames.PARAMS_BUTTONS,ParamsNames.PARAMS_BODY,ParamsNames.PARAMS_ANTENNAS,ParamsNames.PARAMS_CAMERA_BACK_COVER,ParamsNames.PARAMS_CAMERA_BACK_BUMP,ParamsNames.PARAMS_BACK_GLASS]
		meshesParamsNameWithEnvMap.forEach( function(paramName){
			params[paramName].set("envMap",envMap)
		})
	}

	setNewTexture(pathTexture,params,textures){
		params[ParamsNames.PARAMS_BACK_GLASS].set("neededTextures", TextureNames.TYPE_BACK_COVER.texture)
		params[ParamsNames.PARAMS_BACK_GLASS].set("normalMap", textures[pathTexture][TextureNames.NORMAL_MAP])
		params[ParamsNames.PARAMS_BACK_GLASS].set("specularMap", textures[pathTexture][TextureNames.SPECULAR_MAP])
		params[ParamsNames.PARAMS_BACK_GLASS].set("roughnessMap", textures[pathTexture][TextureNames.ROUGH_MAP])
	}

	setNewColor(color,params) {
		params[ParamsNames.PARAMS_BACK_GLASS].set("neededTextures", TextureNames.TYPE_BACK_COVER.color)
		params[ParamsNames.PARAMS_BACK_GLASS].set("cspecColor",color)
	}


}

export {GUI};
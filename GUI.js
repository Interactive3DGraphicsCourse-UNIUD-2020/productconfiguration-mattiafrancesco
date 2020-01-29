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

		var screenMenu = this.menu.addMenu("Screen");
		screenMenu.addItem("On", () => { params[ParamsNames.PARAMS_SCREEN].set("show", 1); });
		screenMenu.addItem("Off", () => { params[ParamsNames.PARAMS_SCREEN].set("show", 0); });
		
		var maxBrightness = 7;
		var brightnessMenu = screenMenu.addMenu("Brightness");
		for(let i=1;i<=maxBrightness;i++)
			brightnessMenu.addItem(i, () => { params[ParamsNames.PARAMS_SCREEN].set("brightness", i*0.4/(maxBrightness-2)+0.6); });
	}
}

export {GUI};
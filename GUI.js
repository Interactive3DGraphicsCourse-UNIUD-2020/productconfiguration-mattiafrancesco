import {Menu} from './Menu.js';

import * as THREE from './build/three.module.js';

import * as ParamsNames from './ParamsNames.js';

class GUI
{
	constructor(htmlContainerID, params)
	{
		var htmlContainer = $("#"+htmlContainerID);

		this.menu = new Menu(htmlContainer);
		
		var antennasMenu = this.menu.addMenu("Antennas");
		antennasMenu.addItem("Red", () => { params[ParamsNames.PARAMS_ANTENNAS].set("cspec", new THREE.Vector3(1,0,0)); });
		antennasMenu.addItem("Green", () => { params[ParamsNames.PARAMS_ANTENNAS].set("cspec", new THREE.Vector3(0,1,0)); });
		antennasMenu.addItem("Blue", () => { params[ParamsNames.PARAMS_ANTENNAS].set("cspec", new THREE.Vector3(0,0,1)); });

		var logoMenu = this.menu.addMenu("Logo");
		logoMenu.addItem("Smooth");
		logoMenu.addItem("Rough");

		var bodyMenu = this.menu.addMenu("Body");
		bodyMenu.addItem("Yellow");
		bodyMenu.addItem("Grey");
		bodyMenu.addItem("Violet");

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
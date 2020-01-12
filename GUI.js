import {Menu} from './Menu.js';

class GUI
{
	constructor(htmlContainerID)
	{
		var htmlContainer = $("#"+htmlContainerID);

		this.menu = new Menu(htmlContainer);
		
		var antennasMenu = this.menu.addMenu("Antennas");
		antennasMenu.addItem("Red");
		antennasMenu.addItem("Green");
		antennasMenu.addItem("Blue");

		var logoMenu = this.menu.addMenu("Logo");
		logoMenu.addItem("Smooth");
		logoMenu.addItem("Rough");

		var bodyMenu = this.menu.addMenu("Body");
		bodyMenu.addItem("Yellow");
		bodyMenu.addItem("Grey");
		bodyMenu.addItem("Violet");

		var screenMenu = this.menu.addMenu("Screen");
		screenMenu.addItem("On");
		screenMenu.addItem("Off");
	}
}

export {GUI};
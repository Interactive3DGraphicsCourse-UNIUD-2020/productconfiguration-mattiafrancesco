import {Menu} from './Menu.js';

class GUI
{
	constructor(htmlContainerID)
	{
		var htmlContainer = $("#"+htmlContainerID);

		this.menu = new Menu();
		htmlContainer.append(this.menu.getHTMLElement());

		this.menu.add("Antennas");
		this.menu.add("Logo");
		this.menu.add("Body");
		this.menu.add("Screen");
	}
}

export {GUI};
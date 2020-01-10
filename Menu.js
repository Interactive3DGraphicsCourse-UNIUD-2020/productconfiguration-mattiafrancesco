import {MenuItem} from './MenuItem.js';

class Menu
{
	constructor()
	{
		this.menu = $("<div></div>");
		this.menu.addClass("productConfiguratorMenu");
	}

	add(menuItem)
	{
		this.menu.append(menuItem.getHTMLElement());
	}

	add(itemContent, itemCallback)
	{
		var menuItem = new MenuItem(itemContent, itemCallback);

		this.menu.append(menuItem.getHTMLElement());
	}

	getHTMLElement()
	{
		return this.menu;
	}
}

export {Menu};
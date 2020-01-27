import {MenuItem} from './MenuItem.js';

class Menu
{
	constructor(container, bottom = 0)
	{
		this.menu = $("<div></div>");
		this.menu.addClass("productConfiguratorMenu");

		if(bottom > 0)
			this.menu.css("bottom", bottom);

		this.subMenus = [];

		this.container = container;
		container.append(this.menu);
	}

	addMenu(menuName)
	{
		var bottom = parseFloat(this.menu.css("bottom").replace(/[^-\d\.]/g, ''))+parseFloat(this.menu.height())+parseFloat(this.menu.css("borderTopWidth").replace(/[^-\d\.]/g, ''));
		var menu = new Menu(this.container, bottom);
		menu.hide();

		this.addItem(menuName, () =>
			{
				if(!menu.isVisible())
				{
					this.hideSubMenus();

					menu.show();
				}
				else
				{
					menu.hide();

					menu.hideSubMenus();
				}
			});

		this.subMenus.push(menu);

		return menu;
	}

	addItem(itemContent, itemCallback)
	{
		var menuItem = new MenuItem(itemContent, itemCallback);

		this.menu.append(menuItem.getHTMLElement());
	}

	hide()
	{
		//this.menu.hide();
		this.menu.slideUp(100);
	}

	show()
	{
		//this.menu.show();
		this.menu.slideDown(100);
	}

	hideSubMenus()
	{
		for(var subMenu of this.subMenus)
		{
			subMenu.hideSubMenus();
			subMenu.hide();
		}
	}

	isVisible()
	{
		return this.menu.is(":visible");
	}

	getHTMLElement()
	{
		return this.menu;
	}
}

export {Menu};
import {Engine} from './Engine.js';

function startPreview()
{
	try
	{
		var engine = new Engine("productConfigurator");

		engine.start();
	}
	catch(e)
	{
		alert(e);
		console.log(e)
	}
}

class Products
{
	constructor()
	{
		this.products = [{title: "iPhone", desc: "Bello smartphone: sovrapprezzato, ma apprezzato", price: 1000, img: "iphone.png", model: "iphone"}, {title: "Coming soon...", desc: "Coming soon...", price: 0, img: "coming-soon.png"}];
		this.productsToShow = this.products;
	}

	show()
	{
		var container = $("#articles");

		for(var product of this.productsToShow)
		{
			var productElem = $("<article></article>");
			container.append(productElem);

			var prodImg = $("<img />");
			prodImg.attr("src", "images/previews/"+product.img);
			productElem.append(prodImg);

			var prodTitle = $("<div></div>");
			prodTitle.addClass("title");
			prodTitle.html(product.title);
			productElem.append(prodTitle);

			var prodPrice = $("<div></div>");
			prodPrice.addClass("price");
			prodPrice.html(product.price+"$");
			productElem.append(prodPrice);
		}
	}
}

export {Products};
import {Engine} from './Engine.js';

class Products
{
	constructor()
	{
		this.products = [{title: "iPhone", desc: "Bello smartphone: sovrapprezzato, ma apprezzato<br /><br /><br />descrizione<br /><br /><br />descrizione<br /><br /><br />descrizione", price: 1000, img: "iphone.png", model: "scene.gltf"}, {title: "Coming soon...", desc: "Coming soon...", price: 0, img: "coming-soon.png"}];
		this.productsToShow = this.products;


		$(document).ready(() =>
		{
			this.show();
		});

		var closeElem = $("#close");
		closeElem.click(() => { this.hideProductsDetails(); });
	}

	show()
	{
		var container = $("#articles");

		for(let product of this.productsToShow)
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

			productElem.click(() =>
			{
				this.showProductsDetails(product);
				
				this.startPreview(product.model);
			});
		}
	}

	startPreview(model)
	{
		try
		{
			var engine = new Engine("productConfigurator", model);

			engine.start();
		}
		catch(e)
		{
			alert(e);
			console.log(e)
		}
	}

	showProductsDetails(product)
	{
		var detailsElem = $("#productDetails");
		detailsElem.show();

		var titleElem = detailsElem.find("#title");
		titleElem.html(product.title);

		var descElem = detailsElem.find("#desc");
		descElem.html(product.desc);

		$("#opacity").show();
	}

	hideProductsDetails()
	{
		$("#productDetails").hide();
		$("#opacity").hide();
	}
}

export {Products};
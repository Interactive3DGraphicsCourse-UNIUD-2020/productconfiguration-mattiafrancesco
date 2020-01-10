class MenuItem
{
	constructor(itemContent, callback = () => {})
	{
		this.link = $("<a></a>");
		this.link.addClass("productConfiguratorMenuItem");
		this.link.attr("href", "javascript:;");


		this.text = $("<div></div>");
		this.text.html(itemContent);
		this.link.append(this.text);

		this.setCallback(callback);
	}

	setCallback(callback)
	{
		this.link.click = callback;
	}

	getHTMLElement()
	{
		return this.link;
	}
}

export {MenuItem};
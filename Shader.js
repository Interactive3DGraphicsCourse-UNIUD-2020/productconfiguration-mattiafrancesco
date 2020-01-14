import * as THREE from './build/three.module.js';

var shaderDir = "./shaders/"

class Shader
{
	constructor(path)
	{
		$.ajax({
			url: shaderDir+path,
			type: "GET",
			async: false,
			contentType: "plain/text"
		}).done((data) =>
		{
			this.data = data;
		});
	}

	getData()
	{
		return this.data;
	}
}

export {Shader};
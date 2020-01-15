var shaderDir = "./shaders/"

class Shader
{
	constructor(path)
	{
		this.vs = this.load(path+"_vert.glsl");
		this.fs = this.load(path+"_frag.glsl");
	}

	load(path)
	{
		var ret;

		$.ajax({
			url: shaderDir+path,
			type: "GET",
			async: false,
			contentType: "plain/text"
		}).done((data) =>
		{
			ret = data;
		});

		return ret;
	}

	getVertex()
	{
		return this.vs;
	}

	getFragment()
	{
		return this.fs;
	}
}

export {Shader};
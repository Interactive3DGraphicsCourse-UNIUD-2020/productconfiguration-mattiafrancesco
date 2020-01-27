import * as THREE from './build/three.module.js';

class ShaderParams
{
	constructor(shader, uniforms = {}, materialExtensions = {}, transparent = false)
	{
		this.meshes = [];

		this.material = new THREE.ShaderMaterial({uniforms: uniforms, vertexShader: shader.getVertex(), fragmentShader: shader.getFragment(), extensions: materialExtensions });
		
		this.material.transparent = transparent;
	}

	addMesh(mesh)
	{
		this.meshes.push(mesh);

		mesh.material = this.material;

		mesh.material.needsUpdate = true;
	}

	add(name, type, value)
	{
		this.material.uniforms[name].type = type;

		update(name, value);
	}

	set(name, value)
	{
		this.material.uniforms[name].value = value;

		this.material.needUpdate = true;
	}
}

export {ShaderParams};
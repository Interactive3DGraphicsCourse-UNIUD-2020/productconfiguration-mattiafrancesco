import * as THREE from './build/three.module.js';

class Group extends THREE.Object3D
{
	constructor()
	{
		super();
		
		super.castShadow = true;
		super.receiveShadow = true;

	}
}

export {Group};
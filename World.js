import * as THREE from './build/three.module.js';

import * as Utils from './utils.js';

import {Group} from './Group.js';

import {GUI} from './GUI.js'
import * as Model from  './Model.js'
var ANIMATION_DURATION = 4000*4;		//in milliseconds

class World
{
	constructor()
	{
		this.scene = new THREE.Scene();

		this.camera = new THREE.PerspectiveCamera(75, Utils.getRatio(), 0.1, 1000);	
		this.camera.position.set(0, 0, 25);

		/*
		//GUI
		this.gui = new GUI();

		//Animations
		this.startTime = Date.now();
		*/
		var object = Model.load('./model/apple_iphone_xs_max/scene.gltf',10,(model) => {

			var i = 0
			model.traverse(function(child)
			{
				if(child.isMesh)
				{
					var random = Math.random()
					var color = 0XFFFFFF * random
					child.material = new THREE.MeshBasicMaterial({color: color})
				}
			});
			model.children[0].children[0].children[1].material = new THREE.MeshBasicMaterial({color: 0XFFFFF})
			this.scene.add(model)
			console.log(model)
		},() => {})
	}

	/*
		Define lights of scena
	*/
	initLights()
	{
		//SunLight
		var sunLight = new THREE.DirectionalLight(0xFFFFFF, 0.5);
		//sunLight.castShadow = true;
		//sunLight.target.position.set(width/2, 0, depth/2);
		//sunLight.position.y = 50;
		//sunLight.shadow.camera.left = sunLight.shadow.camera.bottom = -50;
		//sunLight.shadow.camera.right = sunLight.shadow.camera.top = 50;
		this.scene.add(sunLight);

		//AmbientLight
		var ambientLight = new THREE.AmbientLight(0x999999);
		this.scene.add(ambientLight);
	}

	update()
	{
		/*
		var currentSecond = (Date.now()-this.startTime);
		var amount = currentSecond/ANIMATION_DURATION;

		//Animation
		this.object.update(amount);
		*/
	}
}

export {World};
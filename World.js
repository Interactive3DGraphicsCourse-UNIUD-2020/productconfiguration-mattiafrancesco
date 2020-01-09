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

			// model.traverse(function(child)
			// {
			// 	if(child.isMesh)
			// 	{
			// 		var random = Math.random()
			// 		var color = 0XFFFFFF * random
			// 		child.material = new THREE.MeshBasicMaterial({color: color})
			// 	}
			// });

			var meshes = model.children[0].children[0] // array di mesh
			meshes.children.forEach(mesh => {
				console.log(mesh.name)

				switch (mesh.name) {

					case "AntennaLines": //antenne attorno al telefono
						break
					case "AppleLogo":
						break
					case "BackCameraP1": //bordo nero attorno alle fotocamere, non copre le fotocamere (ha un buco dove sono le fotocamere)
						break
					case "BackCamerasCover001": //si posiziona sopra le fotocamere LE COPRE
						break
					case "BackCameraBottomGreyRing", "BackCameraTopGreyRing": //gli anelli neri delle fotocamere dietro
						break
					case "BackCameraBottomLens","BackCameraTopLens": //lenti fotocamere dietro
						break
					case "BackGlass": //vetro dietro iphone
						break
					case "Body": //tutto il bordo latere del telefono
						break
					case "CameraBump": //la parte in rilievo che contiene le fotocamere dietro
						break
					case "CE": //logo CE dietro
						break
					case "EarphoneGrill": //griglia microfono davanti (sopra il notch)
						break
					case "FlashBG","FlashLED": //elementi che compongono il flash (elemento quadrato in mezzo alle due fotocamere dietro)
						break
					case "Front": //corpo davanti ce circonda lo schermo
						break
					case "FrontCamera": //camera frontale
						break
					case "FrontGlass": //vetro dello schermo schermo
						break
					case "iPhoneLogoBack":
						break
					case "MuteSwitch","PowerButton":
						break
					case "Screen": //schermo ( si trova sotto il vetro "FrontGlass")
						break
					case "Screw": //non ho capito che roba è (è piccola e inutile trascurare)
						break
					case "SimSlot":
						break
					case "Text : Assembled in China", "Text: Designed By Apple in California":
						break
					case "VolumeButtons":
						break
				}

			});

			this.scene.add(model)
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
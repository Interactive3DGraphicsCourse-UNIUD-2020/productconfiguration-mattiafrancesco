import * as THREE from './build/three.module.js';

import Stats from './jsm/libs/stats.module.js';
import {OrbitControls} from './jsm/controls/OrbitControls.js';

import {World} from './World.js';

import {GUI} from './GUI.js';

class Engine
{
	constructor(htmlContainerID)
	{
		this.init(htmlContainerID);
	}

	init(htmlContainerID)
	{
		//Setup renderer
		this.renderer = new THREE.WebGLRenderer({antialias: true});
		this.renderer.setClearColor(0xf0f0f0);
		this.renderer.setPixelRatio(window.devicePixelRatio);
		
		this.renderer.gammaInput = true;
		this.renderer.gammaOutput = true;
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

		//World
		this.world = new World();
		this.world.anisotropy = this.renderer.getMaxAnisotropy();

		//Append canvas
		var canvas = $(this.renderer.domElement);
		canvas.addClass("productConfiguratorCanvas");

		var htmlContainer = $("#"+htmlContainerID);
		htmlContainer.append(canvas);


		//Handle resize
		window.onresize = () => {
			this.resize();
		};

		this.resize();


		//Stats
		this.stats = new Stats();

		//Append stats element
		var statElem = $(this.stats.domElement);
		statElem.addClass("productConfiguratorStats");

		htmlContainer.append(statElem);


		//Menu
		this.gui = new GUI(htmlContainerID, this.world.shaderParams);
		//this.gui.menu.add("tmp", () => { this.world. });
		

		//Controls
		this.controls = new OrbitControls(this.world.camera);
		this.controls.addEventListener("change", this.render.bind(this));
		this.controls.target.set(0, 0, -10);
	}
	
	resize()
	{
		var windowWidth = window.innerWidth;
		var windowHeight = window.innerHeight;

		this.renderer.setSize(windowWidth, windowHeight);
	}

	start()
	{
		console.log("Engine ready!");
		console.log("Starting engine...");

		this.update();
	}

	update()
	{
		requestAnimationFrame(() => {
			this.update();
		});

		this.stats.update();
		this.controls.update();

		this.world.update();
		this.render();
	}
	
	render()
	{
		this.renderer.render(this.world.scene, this.world.camera);
	}
}

export {Engine};
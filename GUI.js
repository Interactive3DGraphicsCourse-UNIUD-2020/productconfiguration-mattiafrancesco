import * as THREE from './build/three.module.js';

import * as dat from './jsm/libs/dat.gui.module.js';

class GUI extends dat.GUI
{
	constructor(sun, ocean, creeper)
	{
		super();

		this.options = this.addFolder('Animations');

		this.options.open();
	}

	add(object, name)
	{
		this.options.add(object, 'speed', 0, 20).name(name+" speed").listen();
	}
}

export {GUI};
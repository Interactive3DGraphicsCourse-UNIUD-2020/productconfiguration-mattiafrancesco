precision highp float;
precision highp int;

varying vec2 vUV;

uniform sampler2D diffuseMap;


void main()
{
	gl_FragColor = vec4(texture2D(diffuseMap, vUV*0.1).rgb, 1.0);
}
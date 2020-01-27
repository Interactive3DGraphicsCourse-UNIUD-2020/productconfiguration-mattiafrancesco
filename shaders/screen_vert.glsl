precision highp float;
precision highp int;

varying vec2 vUV;

void main()
{
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

	vUV = uv;
}
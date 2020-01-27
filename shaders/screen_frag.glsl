varying vec2 vUV;

uniform sampler2D diffuseMap;
uniform float show;
uniform float brightness;


void main()
{
	vec2 uv = vUV * vec2(1, 1.05); //image too high

	vec3 diff = texture2D(diffuseMap, uv).rgb;

	vec3 outRadiance = vec3(0.0);
	if(show > 0.5)
		outRadiance = diff*brightness;

	gl_FragColor = vec4(outRadiance, 1.0);
}
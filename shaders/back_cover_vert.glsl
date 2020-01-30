varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUV;

void main() {
	vec4 vPos = modelViewMatrix * vec4( position, 1.0 );
	vPosition = vPos.xyz;
	vNormal = normalMatrix * normal;
	//				  vec2(1.0/4.0, 1.0/8.0)	to streetch the texture making it fit the back
	//				  vec2(1.0/4.0)				to keep the texture ratio
	vUV = position.xy * vec2(1.0/4.0) + vec2(1.0/2.0);
	gl_Position = projectionMatrix * vPos;
}
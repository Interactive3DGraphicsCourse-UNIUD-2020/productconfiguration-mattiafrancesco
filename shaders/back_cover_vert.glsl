precision highp float;
precision highp int;

attribute vec4 tangent;

varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUV;
varying vec3 vTangent;
varying vec3 vBitangent;

void main() {
	vec4 vPos = modelViewMatrix * vec4( position, 1.0 );
	vPosition = vPos.xyz;

	//for normal
	vNormal = normalize(normalMatrix * normal);
	vec3 objectTangent = vec3( tangent.xyz );
	vec3 transformedTangent = normalMatrix * objectTangent;
	vTangent = normalize( transformedTangent );
	vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );

	vUV = uv;
	gl_Position = projectionMatrix * vPos;
}
precision highp float;
precision highp int;

uniform samplerCube envMap;
uniform sampler2D specularMap;
uniform sampler2D roughnessMap;
uniform sampler2D normalMap;
uniform vec2 textureRepeat;
uniform bool neededTextures;
uniform vec3 cspecColor;
uniform float roughnessColor;

varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUV;
varying vec3 vTangent;
varying vec3 vBitangent;


const float PI = 3.14159;
#define saturate(a) clamp( a, 0.0, 1.0 )

vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}

vec3 BRDF_Specular_GGX_Environment( vec3 normal, vec3 viewDir, const in vec3 cspec, const in float roughness ) {

	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 AB = vec2( -1.04, 1.04 ) * a004 + r.zw;
	return cspec * AB.x + AB.y;

}

float pow2( const in float x ) { return x*x; }

float getSpecularMIPLevel( const in float blinnShininessExponent, const in int maxMIPLevel ) {
	float maxMIPLevelScalar = float( maxMIPLevel );
	float desiredMIPLevel = maxMIPLevelScalar - 0.79248 - 0.5 * log2( pow2( blinnShininessExponent ) + 1.0 );
	return clamp( desiredMIPLevel, 0.0, maxMIPLevelScalar );
}

float GGXRoughnessToBlinnExponent( const in float ggxRoughness ) {
return ( 2.0 / pow2( ggxRoughness + 0.0001 ) - 2.0 );
}


void main() {

	//for normal
	vec3 normal = normalize( vNormal );
	vec3 tangent = normalize( vTangent );
	vec3 bitangent = normalize( vBitangent );
	mat3 vTBN = mat3( tangent, bitangent, normal );
	vec3 mapN = texture2D( normalMap, vUV * textureRepeat).xyz * 2.0 - 1.0;
	mapN.xy = textureRepeat * mapN.xy;
	vec3 n = normalize( vTBN * mapN );
	if(!neededTextures) {
		n = normal;
	}

	//other
	//vec3 n = normalize( vNormal );  // interpolation destroys normalization, so we have to normalize
	vec3 v = normalize( -vPosition);	
	vec3 vReflect = reflect(vPosition,n);
	vec3 r = inverseTransformDirection( vReflect, viewMatrix );
	float nDotv = max(dot( n, v ),0.000001);

	//read textures
	vec3 cspec = texture2D( specularMap, vUV * textureRepeat).rgb;
	cspec = pow( cspec, vec3(2.2));

	float roughness = texture2D( roughnessMap, vUV * textureRepeat).r;

	//Specular
	if (!neededTextures) {
		cspec = cspecColor;
		roughness = roughnessColor;
	}

	float blinnShininessExponent = GGXRoughnessToBlinnExponent(roughness);
	float specularMIPLevel = getSpecularMIPLevel(blinnShininessExponent ,11 );
	vec3 envLight = textureCubeLodEXT( envMap, vec3(-r.x, r.yz), specularMIPLevel ).rgb;
	envLight = pow( envLight, vec3(2.2));
	vec3 outRadiance = envLight * BRDF_Specular_GGX_Environment(n, v, cspec, roughness);;
	
	gl_FragColor = vec4(pow( outRadiance, vec3(1.0/2.2)), 1);

}

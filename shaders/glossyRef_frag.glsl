uniform vec3 cspec;
uniform samplerCube envMap;
uniform float roughness;
uniform float alpha;

precision highp float;
precision highp int;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 uVv;


const float PI = 3.14159;
#define saturate(a) clamp( a, 0.0, 1.0 )

float pow2( const in float x ) { return x*x; }

float getSpecularMIPLevel( const in float blinnShininessExponent, const in int maxMIPLevel ) {
	float maxMIPLevelScalar = float( maxMIPLevel );
	float desiredMIPLevel = maxMIPLevelScalar - 0.79248 - 0.5 * log2( pow2( blinnShininessExponent ) + 1.0 );
	return clamp( desiredMIPLevel, 0.0, maxMIPLevelScalar );
}

float GGXRoughnessToBlinnExponent( const in float ggxRoughness ) {
return ( 2.0 / pow2( ggxRoughness + 0.0001 ) - 2.0 );
}

// vec3 perturbNormal2Arb( vec3 eye_pos, vec3 surf_norm ) {

// 	vec3 q0 = dFdx( eye_pos.xyz );
// 	vec3 q1 = dFdy( eye_pos.xyz );
// 	vec2 st0 = dFdx( uVv.st );
// 	vec2 st1 = dFdy( uVv.st );

// 	vec3 S = normalize(  q0 * st1.t - q1 * st0.t );
// 	vec3 T = normalize( -q0 * st1.s + q1 * st0.s );
// 	vec3 N =  surf_norm ;

// 	mapN.xy = normalScale * mapN.xy;
// 	mat3 tsn = mat3( S, T, N );
// 	return normalize( tsn * mapN );

// }

// http://en.wikibooks.org/wiki/GLSL_Programming/Applying_Matrix_Transformations
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

void main() {
	vec3 n = normalize(vNormal);//perturbNormal2Arb( vPosition, normalize( vNormal ));
	vec3 v = normalize( -vPosition);
	vec3 vReflect = reflect(vPosition,n);
	vec3 r = inverseTransformDirection( vReflect, viewMatrix );

	float blinnShininessExponent = GGXRoughnessToBlinnExponent(roughness);
	float specularMIPLevel = getSpecularMIPLevel(blinnShininessExponent ,11 );

	vec3 envLight = textureCubeLodEXT( envMap, vec3(-r.x, r.yz), specularMIPLevel ).rgb;
	// texture in sRGB, linearize
	envLight = pow( envLight, vec3(2.2));
	vec3 outRadiance = envLight*BRDF_Specular_GGX_Environment(n, v, cspec, roughness);
	// gamma encode the final value
	gl_FragColor = vec4(pow( outRadiance, vec3(1.0/2.2)), alpha);
	//gl_FragColor = vec4(r,1.0);
}
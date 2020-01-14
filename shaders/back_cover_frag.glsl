varying vec3 vNormal;
varying vec3 vPosition;
uniform vec3 pointLightPosition; // in world space
uniform vec3 clight;
uniform vec3 cspec;
uniform float roughness;
const float PI = 3.14159;

vec3 FSchlick(float lDoth) {
	return (cspec + (vec3(1.0)-cspec)*pow(1.0 - lDoth,5.0));
}

float DGGX(float nDoth, float alpha) {
	float alpha2 = alpha*alpha;
	float d = nDoth*nDoth*(alpha2-1.0)+1.0;
	return (  alpha2 / (PI*d*d));
}

float G1(float dotProduct, float k) {
	return (dotProduct / (dotProduct*(1.0-k) + k) );
}

float GSmith(float nDotv, float nDotl) {
		float k = roughness*roughness;
		return G1(nDotl,k)*G1(nDotv,k);
}

void main() {
	vec4 lPosition = viewMatrix * vec4( pointLightPosition, 1.0 );
	vec3 l = normalize(lPosition.xyz - vPosition.xyz);
	vec3 n = normalize( vNormal );  				// interpolation destroys normalization, so we have to normalize
	vec3 v = normalize( -vPosition);				//v -> vettore che va verso la camera: camera - posizioneV (siamo in view space, la camera è nella posizione di origine (0,0,0) quindi basta negare v)
	vec3 h = normalize( v + l);
	// small quantity to prevent divisions by 0
	float nDotl = max(dot( n, l ),0.000001);  		//non posso prendere 0 perche sono valori che vanno al denominatore
	float lDoth = max(dot( l, h ),0.000001);
	float nDoth = max(dot( n, h ),0.000001);
	float vDoth = max(dot( v, h ),0.000001);
	float nDotv = max(dot( n, v ),0.000001);

	//BRDF speculare
	vec3 specularBRDF = FSchlick(lDoth)*GSmith(nDotv,nDotl)*DGGX(nDoth,roughness*roughness)/
										(4.0*nDotl*nDotv);

	vec3 outRadiance = PI* clight * nDotl * specularBRDF;		//equazione di rendering

	// gamma encode the final value, da spazio lineare a gamme encode
	gl_FragColor = vec4(pow( outRadiance, vec3(1.0/2.2)), 1.0);
	//gl_FragColor = vec4(outRadiance,1.0);
}
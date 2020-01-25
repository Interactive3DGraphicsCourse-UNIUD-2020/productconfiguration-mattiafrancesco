uniform vec3 cspec;
uniform samplerCube envMap;
uniform float alpha;

varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 wPosition;
varying vec2 vUv;

const float PI = 3.14159;


vec3 FSchlick(float lDoth) {
    return (cspec + (vec3(1.0)-cspec)*pow(1.0 - lDoth,5.0));
}



// http://en.wikibooks.org/wiki/GLSL_Programming/Applying_Matrix_Transformations
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
    return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}

void main() {
    vec3 n = normalize( vNormal );
    vec3 v = normalize( -vPosition);
    vec3 worldN = inverseTransformDirection( n, viewMatrix );
    vec3 worldV = cameraPosition - wPosition ;

    vec3 r = normalize( reflect(-worldV,worldN));
    float nDotv = max(dot( n, v ),0.000001);
    vec3 fresnel = FSchlick(nDotv);

    vec3 envLight = textureCube( envMap, vec3(-r.x, r.yz)).rgb;

    envLight = pow( envLight, vec3(2.2));
    vec3 outRadiance = fresnel*envLight; //riflesso

    gl_FragColor = vec4(pow( outRadiance, vec3(1.0/2.2)), alpha);
}
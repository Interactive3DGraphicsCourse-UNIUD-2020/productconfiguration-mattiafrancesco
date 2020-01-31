uniform vec3 cdiff;
uniform samplerCube envMap;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 wPosition;
varying vec2 uVv;

const float PI = 3.14159;



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
    // small quantity to prevent divisions by 0
    float nDotv = max(dot( n, v ),0.000001);
    // negate x to account for how cubemap is displayed on background
    vec3 irradiance = textureCube( envMap, worldN).rgb;
    // texture in sRGB, linearize
    irradiance = pow( irradiance, vec3(2.2));
    vec3 outRadiance = cdiff*irradiance;
    // gamma encode the final value
    gl_FragColor = vec4(pow( outRadiance, vec3(1.0/2.2)), 1.0);
}
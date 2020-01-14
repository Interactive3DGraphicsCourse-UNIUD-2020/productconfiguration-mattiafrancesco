void main() {
	vec4 vPos = modelViewMatrix * vec4( position, 1.0 );
	gl_Position = projectionMatrix * vPos;
}
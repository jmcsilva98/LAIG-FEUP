#ifdef GL_ES
precision highp float;
#endif


attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying vec2 vTextureCoord;
uniform sampler2D uSampler3;
uniform sampler2D uSampler2;


uniform float normScale;
uniform float timeFactor;

void main() {
vec3 offset=vec3(0.0,0.0,0.0);

vTextureCoord = aTextureCoord;

vec4 aux = texture2D(uSampler3, vTextureCoord);

offset.x = timeFactor;
offset.y = (0.2126 * aux.r + 0.7152 * aux.g + 0.0722*aux.b)*normScale;
offset.z = timeFactor;
gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition+offset, 1.0);
}

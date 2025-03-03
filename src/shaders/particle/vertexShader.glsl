varying vec2 vUv;

void main()
{
    vec3 newPosition = position;
    vec4 modelPosition = modelMatrix * vec4(sin(position), 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;
    gl_Position = projectionPosition;

    vUv = uv;
}
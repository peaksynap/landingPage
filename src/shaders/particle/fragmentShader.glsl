

// uniform vec2 u_resolution;

uniform vec3 uColor1;
uniform vec3 uColor2;
uniform float uThreshold;




varying vec2 vUv;


void main()
{
   vec3 colour = vec3(0.0);
   // vec3 color1 = vec3 color1;

   vec3 pink = vec3(0.788,0.227,1.);
   vec3 purple = vec3(0.392,0.373,0.824);
  

   colour = mix(uColor1, uColor2, smoothstep(0.0, uThreshold, vUv.x));

  // colour = vec3(1.0, 0.0, 0.0);
    

  gl_FragColor = vec4(colour, colour.y );


}
#ifdef USE_FOG
  vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
  // float noise =  20.0*cnoise( mod(opacity/5000.0, 6000.0) + 4000.0*worldPosition.xyz);
  float noise = 0.0;
  // fogDepth = - mvPosition.z;
  fogDepth = -(mvPosition.z*1.5);
  fogDepth = max(fogDepth - pow(worldPosition.y,1.2), 0.0);
  // fogDepth -= noise;
#endif

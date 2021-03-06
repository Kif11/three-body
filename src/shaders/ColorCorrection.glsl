float distHoriz = sunCentroid.y/1000.0;

gl_FragColor.r = clamp(clamp(4.0*(distHoriz),1.0,4.0) *  pow( gl_FragColor.r,  clamp(distHoriz,1.0,3.0)),0.0,1.0);
gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(255.0/255.0, 198.0/255.0, 85.0/255.0), clamp(distHoriz,0.0,0.3));

gl_FragColor.rgb += fadeOutTime/abs(fadeOutTime)*pow(abs(fadeOutTime),2.0);

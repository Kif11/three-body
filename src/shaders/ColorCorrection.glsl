float distHoriz = sunCentroid.y/1000.0; // 0 and 2
// gl_FragColor.r = clamp(distHoriz,0.5,0.9) * 16.051051051 * pow( gl_FragColor.r, 3.0 ) ;
// gl_FragColor = vec4(gl_FragColor.rgb, gl_FragColor.a);
// gl_FragColor = vec4((20.0 + 4.0*sin(time))*pow(gl_FragColor.r,4.0), gl_FragColor.g, gl_FragColor.b, gl_FragColor.a);


gl_FragColor.r = clamp(4.0*(distHoriz),1.0,4.0) *  pow( gl_FragColor.r,  clamp(distHoriz,1.0,3.0) ) ;
gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(255.0/255.0, 198.0/255.0, 85.0/255.0), clamp(distHoriz,0.0,0.3));

gl_FragColor.rgb += 0.01*fadeOutTime;
// gl_FragColor.b = 8.0*pow( gl_FragColor.b, 2.0 ) ;

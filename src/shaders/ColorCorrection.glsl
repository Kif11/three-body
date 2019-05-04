float distHoriz = sunCentroid.y/1000.0 +  1.0;
gl_FragColor.r = clamp(distHoriz,0.5,0.9) * 16.051051051 * pow( gl_FragColor.r, 3.0 ) ;
gl_FragColor = vec4(gl_FragColor.rgb, gl_FragColor.a);
// gl_FragColor = vec4((20.0 + 4.0*sin(time))*pow(gl_FragColor.r,4.0), gl_FragColor.g, gl_FragColor.b, gl_FragColor.a);

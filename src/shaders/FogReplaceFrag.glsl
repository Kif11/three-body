
#define whiteCompliment(a) ( 1.0 - saturate( a ) )

#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = whiteCompliment( exp2( - fogDensity * fogDensity * fogDepth * fogDepth * LOG2 ) );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, fogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor/2.0 );
#endif

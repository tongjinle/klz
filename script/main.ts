/// <reference path="../typings/index.d.ts" />

let config: RequireConfig = {
	baseUrl: './dist/logic',
	paths: {
		
		underscore:'/bower_components/underscore/underscore'
	},
	//加载顺序规则
	shim: {
	}
	
};
require.config(config);



requirejs(['underscore'], (_:UnderscoreStatic) => {
	
	
});
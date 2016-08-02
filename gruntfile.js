module.exports = function(grunt) {
	require("colors");
	// show elapsed time at the end  
	require('time-grunt')(grunt);
	// load all grunt tasks  
	require('load-grunt-tasks')(grunt);

	// typescript 
	var tsSource = ['logic/**/*.ts'];
	var tsDist = 'dist/js/';

	// less
	var lessSource = ['less/**/*.less', 'directive/less/**/*.less'];
	var lessDist = 'css/bundle.css';


	// watchPathList
	var watchPathList = {
		'main': ['main.html', 'main-dev.html'],
		'html': ['view/**/*.{html,htm}', 'directive/**/*.{html,htm}'],
		'css': 'css/bundle.css',
		'js': 'dist/**/*.js'
	};
	var arr = [];
	for (var key in watchPathList) {
		arr = arr.concat(watchPathList[key]);
	}
	console.log(arr);

	// livereload
	var livereload = '';


	grunt.initConfig({
		watch: {
			typescript: {
				files: tsSource,
				tasks: ['typescript']
			},
			jasmine: {
				files: 'dist/**/*.js',
				tasks: ['jasmine_nodejs']
			}
		},
		less: {
			dev: {
				files: {
					lessDist: lessSource
				}
			}
		},

		connect: {
			options: {
				port: 9001,
				livereload: 35731,
				// change this to '0.0.0.0' to access the server from outside  
				hostname: 'localhost'
			},
			livereload: {
				options: {
					open: 'http://<%= connect.options.hostname %>:<%= connect.options.port %>/main-dev.html',
				}
			},
			genDoc: {
				options: {
					open: 'http://<%= connect.options.hostname %>:<%= connect.options.port %>/<%= jsdoc.dist.options.destination%>/index.html'
				}
			},
			produce: {
				options: {
					open: 'http://<%= connect.options.hostname %>:<%= connect.options.port %>/main.html'
				}
			}
		},
		requirejs: {
			compile: {
				options: {
					baseUrl: "./",
					mainConfigFile: "script/main.js",
					// name: "path/to/almond",
					/* 
					assumes a production build using almond, if you don't use almond, you
					need to set the "includes" or "modules" option instead of name 
					*/
					// optimize: "none",
					include: ["script/main.js"],
					out: "minSrc/min.js"
				}
			}
		},
		jsdoc: {
			dist: {
				src: ['service/script/*.js', 'script/*.js'],
				options: {
					destination: 'doc',
					template: "node_modules/ink-docstrap/template",
					configure: "node_modules/ink-docstrap/template/jsdoc.conf.json"
				}
			}
		},
		typescript: {
			base: {
				src: tsSource,
				dest: tsDist,
				options: {
					generateTsConfig: true,
					module: 'commonjs', //or commonjs 
					target: 'es5', //or es3 
					sourceMap: false,
					declaration: false
				}
			}
		},
		typedoc: {
			base: {
				src: '<%= typescript.base.src %>',
				options: {
					module: '<%= typescript.base.options.module %>',
					out: './docs',
					name: 'my-doc',
					target: '<%= typescript.base.options.target %>'
				}
			}
		},
		jasmine_nodejs: {
			// task specific (default) options 
			options: {
				specNameSuffix: ["Spec.js"], // also accepts an array 
				helperNameSuffix: "helper.js",
				useHelpers: false,
				random: false,
				seed: null,
				defaultTimeout: null, // defaults to 5000 
				stopOnFailure: false,
				traceFatal: true,
				// configure one or more built-in reporters 
				reporters: {
					console: {
						colors: true, // (0|false)|(1|true)|2 
						cleanStack: 1, // (0|false)|(1|true)|2|3 
						verbosity: 4, // (0|false)|1|2|3|(4|true) 
						listStyle: "indent", // "flat"|"indent" 
						activity: false
					},
					// junit: { 
					//     savePath: "./reports", 
					//     filePrefix: "junit-report", 
					//     consolidate: true, 
					//     useDotNotation: true 
					// }, 
					// nunit: { 
					//     savePath: "./reports", 
					//     filename: "nunit-report.xml", 
					//     reportName: "Test Results" 
					// }, 
					// terminal: { 
					//     color: false, 
					//     showStack: false, 
					//     verbosity: 2 
					// }, 
					// teamcity: true, 
					// tap: true 
				},
				// add custom Jasmine reporter(s) 
				customReporters: []
			},
			your_target: {
				// target specific options 
				options: {
					useHelpers: true
				},
				// spec files 
				specs: [
					"dist/logic/test/**"
				],
				helpers: [
					"test/helpers/**"
				]
			}
		}

	});

	grunt.registerTask('serve', ['typescript']);

	grunt.registerTask('test', [
		'typescript',
		'jasmine_nodejs',
		'watch'
	]);


	grunt.registerTask('default', ['serve']);
};
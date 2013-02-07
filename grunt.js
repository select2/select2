module.exports = function(grunt) {
	"use strict";

	// Project configuration.
	grunt.initConfig({
		pkg : "<json:package.json>",
		meta : {
			banner : '/**\n' +
				' * <%= pkg.name %> <%= pkg.version %>\n' +
				' * <%= pkg.homepage %>\n' +
				' *\n' +
				' * <%= pkg.description %>\n' +
				' *\n' +
				' * Copyright (c)<%= grunt.template.today("yyyy") %> <%= pkg.author.name %>\n' +
				' * Distributed under Apache license or GNU license\n' +
				' */'
		},
		concat : {
			dist : {
				src : [
					"<banner>",
					"src/select2.js"
				],
				dest : "dist/select2.js"
			}
		},
		lint : {
			all : ["grunt.js", "src/**/*.js"]
		},
		min : {
			"dist/select2.min.js" : ["<banner>", "dist/select2.js"]
		},
		jshint : {
			options: {
				curly     : false,
				eqeqeq    : true,
				immed     : true,
				latedef   : true,
				noempty   : true,
				newcap    : true,
				noarg     : true,
				sub       : true,
				undef     : true,
				boss      : true,
				eqnull    : true,
				node      : true,
				smarttabs : true,
				es5       : true
			},
			globals : {
				exports : true,
				define  : true
			}
		}
	});

	// Default task.
	grunt.registerTask("default", "concat min");
};

module.exports = function(grunt) {
	'use strict';

	// Project configuration.
	grunt.initConfig({
		pkg : '<json:package.json>',
		replace: {
			dist: {
				options: {
					variables: {
						name: '<%= pkg.name %>',
						title: '<%= pkg.title %>',
						description: '<%= pkg.description %>',
						version: '<%= pkg.version %>',
						year: '<%= grunt.template.today("yyyy") %>',
						timestamp: '<%= grunt.template.today() %>',
						jquery_version: '<%= pkg.dependencies.jquery %>'
					},
					prefix: '@@'
				},
				files: {
					'./': [
						'src/build/component.json',
						'src/build/select2.jquery.json',
						'src/build/banner.txt'
					]
				}
			}
		},
		concat : {
			js: {
				src : [
					'banner.txt',
					'src/select2.js'
				],
				dest : 'dist/select2.js'
			},
			css: {
				src : [
					'banner.txt',
					'src/select2.css'
				],
				dest : 'dist/select2.css'
			}
		},
		lint : {
			all : [ 'grunt.js', 'src/**/*.js' ]
		},
		min : {
			'dist/select2.min.js' : ['banner.txt', 'dist/select2.js']
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

	grunt.loadNpmTasks('grunt-replace');

	// Default task.
	grunt.registerTask('default', 'replace concat:js concat:css min');
};

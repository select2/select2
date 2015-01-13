module.exports = function (grunt) {
	"use strict";
	
	// Project configuration.	
	grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
		uglify: {
			select2: { 
				src: 'select2.js',
				dest: 'min/',    
				expand: true,    
				flatten: true,   
				ext: '.min.js'   
			}
		}
	});
	
	// Load the plugin that provides the "jshint" task.
	grunt.loadNpmTasks('grunt-contrib-uglify');
	
	// Default task(s).
	grunt.registerTask("default",["uglify"]);
}
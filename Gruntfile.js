module.exports = function (grunt) {
  // Full list of files that must be included by RequireJS
  includes = [
    'jquery.select2'
  ];

  amdIncludes = [
    'almond'
  ];

  fullIncludes = [
    'jquery'
  ].concat(includes);

  grunt.initConfig({
    uglify: {
      'dist': {
        src: 'dist/js/select2.js',
        dest: 'dist/js/select2.min.js'
      },
      'dist.full': {
        src: 'dist/js/select2.full.js',
        dest: 'dist/js/select2.full.min.js'
      }
    },

    qunit: {
      all: [
        'tests/**/*.html'
      ]
    },

    jshint: {
      options: {
        jshintrc: true
      },
      code: {
        src: ["src/js/**/*.js"]
      },
      tests: {
        src: ["tests/**/*.js"]
      }
    },

    sass: {
      dist: {
        options: {
          outputStyle: "compressed"
        },
        files: {
          "dist/css/select2.min.css": [
            "src/scss/core.scss",
            "src/scss/theme/default/layout.css"
          ]
        }
      },
      dev: {
        options: {
          outputStyle: "nested"
        },
        files: {
          "dist/css/select2.css": [
            "src/scss/core.scss",
            "src/scss/theme/default/layout.css"
          ]
        }
      }
    },

    requirejs: {
      "dist": {
        options: {
          baseUrl: "src/js",
          optimize: "none",
          name: "select2/core",
          out: "dist/js/select2.js",
          include: amdIncludes.concat(includes),
          paths: {
            almond: "../../vendor/almond-0.2.9",
            jquery: "jquery.shim"
          }
        }
      },
      "dist.full": {
        options: {
          baseUrl: "src/js",
          optimize: "none",
          name: "select2/core",
          out: "dist/js/select2.full.js",
          include: amdIncludes.concat(fullIncludes),
          paths: {
            almond: "../../vendor/almond-0.2.9",
            jquery: "../../vendor/jquery-2.1.0"
          }
        }
      },
      "amd": {
        options: {
          baseUrl: "src/js",
          optimize: "none",
          name: "select2/core",
          out: "dist/js/select2.amd.js",
          paths: {
            jquery: "empty:"
          }
        }
      },
      "amd.full": {
        options: {
          baseUrl: "src/js",
          optimize: "none",
          name: "select2/core",
          out: "dist/js/select2.amd.full.js",
          include: fullIncludes,
          paths: {
            jquery: "empty:"
          }
        }
      }
    },

    concat: {
      "dist": {
        src: [
          "src/js/start.js",
          "dist/js/select2.js",
          "src/js/end.js"
        ],
        dest: "dist/js/select2.js"
      },
      "dist.full": {
        src: [
          "src/js/start.js",
          "dist/js/select2.full.js",
          "src/js/end.js"
        ],
        dest: "dist/js/select2.full.js"
      }
    },

    watch: {
      js: {
        files: [
          "src/js/select2/**/*.js",
          "tests/**/*.js",
        ],
        tasks: [
          "compile",
          "test",
          'minify'
        ]
      },
      css: {
        files: [
          "src/scss/**/*.scss"
        ],
        tasks: [
          "compile",
          'minify'
        ]
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-concat")
  grunt.loadNpmTasks("grunt-contrib-jshint")
  grunt.loadNpmTasks("grunt-contrib-qunit")
  grunt.loadNpmTasks("grunt-contrib-requirejs")
  grunt.loadNpmTasks("grunt-contrib-uglify")
  grunt.loadNpmTasks("grunt-contrib-watch")

  grunt.loadNpmTasks("grunt-sass")

  grunt.registerTask("default", ["compile", "test", "minify"])

  grunt.registerTask("compile", ["requirejs", "sass:dev", "concat"])
  grunt.registerTask("minify", ["uglify", "sass:dist"])
  grunt.registerTask("test", ["qunit", "jshint"])
}

module.exports = function (grunt) {
  // Full list of files that must be included by RequireJS
  includes = [
    'jquery.select2'
  ];

  amdIncludes = [
    'almond'
  ];

  fullIncludes = [
    'jquery',
    'jquery.mousewheel',

    'select2/compat/matcher',

    'select2/dropdown/attachContainer'
  ].concat(includes);

  var i18nModules = [];
  var i18nPaths = {};

  var i18nFiles = grunt.file.expand({
    cwd: 'src/js'
  }, 'select2/i18n/*.js');

  for (var i = 0; i < i18nFiles.length; i++) {
    var file = i18nFiles[i];
    var name = file.split('.')[0];

    i18nModules.push({
      name: name
    });

    i18nPaths[name] = '../../' + name;
  }

  grunt.initConfig({
    clean: {
      docs: ['docs/_site']
    },

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

    'gh-pages': {
      options: {
        base: 'docs',
        branch: 'master',
        clone: 'node_modules/grunt-gh-pages/repo',
        message: 'Updated docs with master',
        push: true,
        repo: 'git@github.com:select2/select2.github.io.git'
      },
      src: '**'
    },

    jekyll: {
      options: {
        src: 'docs',
        dest: 'docs/_site'
      },
      build: {
        d: null
      },
      serve: {
        options: {
          serve: true,
          watch: true
        }
      }
    },

    jshint: {
      options: {
        jshintrc: true
      },
      code: {
        src: ['src/js/**/*.js']
      },
      tests: {
        src: ['tests/**/*.js']
      }
    },

    sass: {
      dist: {
        options: {
          outputStyle: 'compressed'
        },
        files: {
          'dist/css/select2.min.css': [
            'src/scss/core.scss',
            'src/scss/theme/default/layout.css'
          ]
        }
      },
      dev: {
        options: {
          outputStyle: 'nested'
        },
        files: {
          'dist/css/select2.css': [
            'src/scss/core.scss',
            'src/scss/theme/default/layout.css'
          ]
        }
      }
    },

    symlink: {
      docs: {
        cwd: 'dist',
        expand: true,
        overwrite: false,
        src: [
          '*'
        ],
        dest: 'docs/dist',
        filter: 'isDirectory'
      }
    },

    requirejs: {
      'dist': {
        options: {
          baseUrl: 'src/js',
          optimize: 'none',
          name: 'select2/core',
          out: 'dist/js/select2.js',
          include: amdIncludes.concat(includes),
          paths: {
            almond: '../../vendor/almond-0.2.9',
            jquery: 'jquery.shim'
          },
          wrap: grunt.file.readJSON('src/js/banner.json')
        }
      },
      'dist.full': {
        options: {
          baseUrl: 'src/js',
          optimize: 'none',
          name: 'select2/core',
          out: 'dist/js/select2.full.js',
          include: amdIncludes.concat(fullIncludes),
          paths: {
            almond: '../../vendor/almond-0.2.9',
            jquery: '../../vendor/jquery-2.1.0',
            'jquery.mousewheel': '../../vendor/jquery.mousewheel'
          },
          wrap: grunt.file.readJSON('src/js/banner.json')
        }
      },
      'amd': {
        options: {
          baseUrl: 'src/js',
          optimize: 'none',
          name: 'select2/core',
          out: 'dist/js/select2.amd.js',
          include: includes,
          paths: {
            jquery: 'empty:'
          },
          wrap: grunt.file.readJSON('src/js/banner.json')
        }
      },
      'amd.full': {
        options: {
          baseUrl: 'src/js',
          optimize: 'none',
          name: 'select2/core',
          out: 'dist/js/select2.amd.full.js',
          include: fullIncludes,
          paths: {
            jquery: 'empty:',
            'jquery.mousewheel': '../../vendor/jquery.mousewheel'
          },
          wrap: grunt.file.readJSON('src/js/banner.json')
        }
      },
      'i18n': {
        options: {
          baseUrl: 'src/js/select2/i18n',
          dir: 'dist/js/i18n',
          paths: i18nPaths,
          modules: i18nModules,
          wrap: grunt.file.readJSON('src/js/banner.json')
        }
      }
    },

    watch: {
      js: {
        files: [
          'src/js/select2/**/*.js',
          'tests/**/*.js'
        ],
        tasks: [
          'compile',
          'test',
          'minify'
        ]
      },
      css: {
        files: [
          'src/scss/**/*.scss'
        ],
        tasks: [
          'compile',
          'minify'
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-symlink');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.loadNpmTasks('grunt-gh-pages');
  grunt.loadNpmTasks('grunt-jekyll');
  grunt.loadNpmTasks('grunt-sass');

  grunt.registerTask('default', ['compile', 'test', 'minify']);

  grunt.registerTask('compile', ['requirejs', 'sass:dev']);
  grunt.registerTask('minify', ['uglify', 'sass:dist']);
  grunt.registerTask('test', ['qunit', 'jshint']);

  grunt.registerTask('docs', ['symlink:docs', 'jekyll:serve']);

  grunt.registerTask('docs-release', ['default', 'clean:docs', 'gh-pages']);
};

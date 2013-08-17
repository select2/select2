/* jshint node: true */

module.exports = function(grunt) {
    "use strict";

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        license: grunt.file.read('LICENSE'),

        jshint: {
            select2: {
                src: "select2.js"
            },
            gruntfile: {
                src: 'Gruntfile.js'
            }
        },

        uglify: {
            options: {
                banner: '/**\n' +
                    '<%= license %>' +
                    '*/\n'
            },
            select2: {
                src: ['select2.js'],
                dest: 'select2.min.js'
            }
        },

        less: {
            select2: {
                files: {
                    "select2.css": "select2.less"
                }
            },

            min: {
                options: {
                    yuicompress: true
                },
                files: {
                    "select2.min.css": "select2.less"
                }
            }
        },

        sed: {
            descriptorversion: {
                pattern: "\"version\": \"([0-9\.]+)\"",
                replacement: "\"version\": \"<%= pkg.version %>\"",
                path: ["bower.json", "select2.jquery.json"]
            },
            fileversion: {
                pattern: "@@ver@@",
                replacement: "<%= pkg.version %>",
                path: ["select2.js", "select2.min.js", "select2.less", "select2.css", "select2.min.css"]
            },
            filetime: {
                pattern: "@@timestamp@@",
                replacement: '<%= grunt.template.today("dd mm h:MM:ss yyyy Z") %>',
                path: ["select2.js", "select2.min.js", "select2.less", "select2.css", "select2.min.css"]
            }
        },

        gitcommit: {
            descriptorversion: {
                options: {
                    message: "modified version identifiers in descriptors for release <%= pkg.version %>"
                },
                files: {
                    src: ["package.json", "bower.json", "select2.jquery.json"]
                }
            }
        },

        gitcheckout: {
            build: {
                options: {
                    branch: 'build-<%= pkg.version %>',
                    create: true
                }
            }
        },
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-git');
    grunt.loadNpmTasks('grunt-sed');

    grunt.registerTask('test', 'jshint');

    grunt.registerTask('dist', ['uglify', 'less']);

    grunt.registerTask('default', ['test', 'dist']);
};

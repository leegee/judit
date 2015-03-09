/*global module:false, require:false*/
/**
* @fileOverview CDN Javascript Gruntfile.js — tests, builds, documents
* @example
*
* sudo npm install -g grunt-cli
* npm install
* grunt --help // Display all targets
* grunt jshint // Lint
* grunt test   // Run checks and test
* grunt test --verbose
* grunt test --verbose --stack
*
* @module Gruntfile
* Please see `package.json` for a full list of dependencies.
* @requires fs
* @requires walk
* @requires grunt-requirejs
* @requires grunt-replace
* @requires grunt-contrib-watch
* @requires grunt-contrib-connect
* @requires grunt-contrib-jshint
* @requires grunt-bump
* @requires grunt-jsdoc
* @requires grunt-docco
* @requires grunt-todos
* @requires grunt-contrib-clean
* @requires grunt-contrib-copy
* @requires grunt-contrib-rename
* @requires grunt-generate
* @version 0.1.0
* @author Lee Goddard
*/

module.exports = function(grunt) {
    'use strict';

    var Fs      = require('fs');
    var Walk    = require('walk');

    /** Path to the desiination 'dist/' directory to serve minified files live. */
    var DIST_PATH = 'dist/';
    var OPTIMIZED_JS = "out/app-optimized.js";

    /** Port on whcih to run the Connect server for tests.
    * @see tests/testrunner.html, which also specs the port. */
    var DEV_PORT = 8181;

    var connectCORDSmiddleware = function (connect, options, next) {
        return [
            function(req, res, next) {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
                res.setHeader('Access-Control-Allow-Methods', 'OPTIONS,GET,PUT,POST,DELETE,HEAD,TRACE');
                return next();
            },
            connect.static(require('path').resolve('.'))
        ];
    };

    // grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-requirejs');
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-bump');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-docco');
    grunt.loadNpmTasks('grunt-todos');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-rename');
    grunt.loadNpmTasks('grunt-mocha');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
                '<%= grunt.template.today("yyyy-mm-dd") %>\n',

        /** <h4>Task</h4> Runs a strict syntax check to pick up
         * common coding errors and legal syntax which may cause
         * problems for optimization.
         * @name jshint
         * @memberOf module:Gruntfile
         */
        jshint: {
            files: {
                src: ['_/js/*.js'],
            },
            options: {
                '-W015': true, // Mixed tabs and spaces
                curly   : true,
                eqeqeq  : true,
                immed   : true,
                latedef : true,
                newcap  : true,
                noarg   : true,
                sub     : true,
                undef   : true,
                boss    : true,
                eqnull  : true,
                browser : true,
                globals: {
                    define  : true,     // requirejs
                    require : true,     // requuirejs
                    global  : true,     // ours
                    console : true,     // of window

                    // just in spec/
                    beforeEach  : true,
                    afterEach   : true,
                    describe    : true,
                    expect      : true,
                    it          : true,
                    spyOn       : true, // sinon
                    xdescribe   : true,
                    xit         : true
                },
                ignores: [
                ],
                reporter: require('jshint-stylish')
            }
        },

        /** <h4>Task</h4> Creates Javadoc-like documentation into
         * the URI `/scripts/docs' when in dev mode.
         * @name jsdoc
         * @memberOf module:Gruntfile
         */
        jsdoc : {
            dist : {
                src: [
                    'README.md',
                    '_/js/*.js'
                ],
                dest: '_/js/docs/',
                options: {
                    configure: 'jsdoc.config.json',
                    template:  'node_modules/ink-docstrap/template'
                }
            }
        },

        /** <h4>Task</h4> Publishes annotated source code
         * to the URI `/docs-tech/`, when in dev mode.
         * problems for optimization.
         * @name docco
         * @memberOf module:Gruntfile
         */
        docco: {
            debug: {
                src: ['_/js/*.js'],
                options: {
                    output: '_/js/docs-tech/'
                }
            }
        },


        /** <h4>Task</h4> Runs the Mocha tests on `connect` via Phantom JS.
         * Jenkins support is TODO via https://github.com/futurice/mocha-jenkins-reporter
         * This task uses the `spec/runner.html` to run tests, to allow us to use the
         * same framework for server-side and browser testing.
         * @name mocha
         * @memberOf module:Gruntfile
         * @see module:Gruntfile#connect
         */
        mocha: {
            test: {
                options: {
                    log         : true,
                    logErrors   : true,
                    run         : false,
                    reporter    : 'Spec',
                    hostname    : '*',
                    port        : parseInt( DEV_PORT ), /** Also in test.html */
                    ui          : 'bdd', /** Passed to mocha.setup() */
                    urls        : [ 'http://127.0.0.1:' + DEV_PORT + '/test.html' ]
                }
            }
        },

        /** <h4>Task</h4>
         * Lists source that matches `TODO`, `XXX`, `FIXME`.
         * @name todos
         * @memberOf module:Gruntfile
         */
        todos: {
            options: {
                priorities: {
                    low  : /TODO/,
                    med  : /(XXX|Lee)/i,
                    high : /FIXME/i
                },
                reporter: 'markdown' // default | markdown | path
            },
            files: ['_/js/*.js']
        },

        /** <h4>Task</h4> Bump the `package.json` version, commit, tag, and push.
         * `bump-commit` does the same without bumping the vesrion;
         * `bump-only` just increments the version.
         * @name bump
         * @memberOf module:Gruntfile
         */
        bump: {
            options: {
                files           : ['package.json'],
                updateConfigs   : [],
                commit          : true,
                commitMessage   : 'Release v%VERSION%',
                commitFiles     : ['-a'],
                createTag       : false,
                tagName         : 'v%VERSION%',
                tagMessage      : 'Version %VERSION%',
                push            : false,
                pushTo          : 'upstream',
                gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d'
            }
        },

        /** <h4>Task</h4> When any of the listed files changes, runs the `jshint` task.
         * @name watch
         * @memberOf module:Gruntfile
         */
        watch: {
            scripts: {
                files: [
                    '_/js/*.js',
                    'tests/**/*.js',
                    'tests/runner.html'
                ],
                tasks: [ 'jshint'],
                options: {
                    spawn           : false,
                    interrupt       : true,
                    debounceDelay   : 1000,
                },
            },
        },

        /** <h4>Task</h4> Concatinate, minify, and uglify the JS source for public distribution.
         * Note that this task is *not* a stand-alone task: its configuration needsd
         * to be completed by first running the `build` task. Uses `r.js` and `ugilfy2`.
         * @name requirejs
         * @memberOf module:Gruntfile
         */
        requirejs: {
            compile: {
                options: {
                    almond: true,
                    baseUrl: "_/js/",
                    mainConfigFile: "_/js/app.js",
                    // name: "path/to/almond", // assumes a production build using almond
                    out: OPTIMIZED_JS,
                    name: 'app.js',
                    optimize: "uglify2"
                }
            }
        },

        clean: {
            /** <h4>Task</h4> Cleans the 'distribution' directory as part of the `build` target.
             * @name clean:build
             * @memberOf module:Gruntfile
             */
            build: {
                src: [ DIST_PATH ]
            },
            /** <h4>Task</h4> Cleans the documentation directories as part of the `docs` target.
             * @name clean:docs
             * @memberOf module:Gruntfile
             */
            docs: {
                src: [ 'docs', 'docs-tech' ]
            },
            options: { force: true }
        },

        /** <h4>Task</h4> Copies files for to the 'distribution' directory as part of the `build` target.
         * @name copy
         * @memberOf module:Gruntfile
         */
        // copy: {
        //     main: {
        //         files: [
        //             // 'requirejs' task does not put this anywhere:
        //             {
        //                 nonull: true,
        //                 expand: true,
        //                 src: [ '_/js/vendor/require.js' ],
        //                 dest: DIST_PATH
        //             }
        //         ]
        //     }
        // },

        // * <h4>Task</h4> Renames files in the 'distribution' directory as part of the `build` target.
        //  * @name rename
        //  * @memberOf module:Gruntfile

        // rename: {
        //     main: {
        //         files: [
        //             {
        //                 src: [ DIST_PATH + '/app/require-global-config.js' ],
        //                 dest:  DIST_PATH + '/require-global-config.js'
        //             }
        //         ]
        //     }
        // },

        connect: {
            /** <h4>Task <code>connect:mocha</code></h4>
             * Runs an instance of a Connect server for use with the `mocha` task.
             * @name connect:test
             * @memberOf module:Gruntfile
             */
            mocha: {
                options: {
                    hostname    : '*',
                    port        : DEV_PORT,
                    base        : '.',
                    debug       : true,
                    // keepalive    : true,
                    middleware  : connectCORDSmiddleware
                }
            },

        /** <h4>Task connect:build_test</h4>
         * As the <code>connect:test</code> task, but on a different port, with a
         * document root of (@link DIST_PATH}.
         * @name connect:build_test
         * @memberOf module:Gruntfile
         */
            build_test: {
                options: {
                    hostname: '*',
                    port: 88889, // Should also be in test/runner.html
                    base: DIST_PATH,
                    debug: true,
                    // keepalive: true, // open: '/spec/runner.html',
                    middleware  : connectCORDSmiddleware
                }
            }
        }
    });



    grunt.registerTask('default',   [ 'test']);
    grunt.registerTask('docs',      [ 'jshint', 'clean:docs', 'jsdoc', 'docco' ]);
    grunt.registerTask('test',      [ 'jshint', 'connect:mocha', 'mocha']);

    // 'Build with dynamic configuration - do not call requirejs directly'
    // grunt.registerTask( 'build',    [ 'test', 'clean:build', 'requirejs', 'copy', 'rename', 'connect:build_test', ]);
    grunt.registerTask( 'build',    [ 'requirejs' ]);
};











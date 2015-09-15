module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt, ['grunt-*', 'intern-geezer']);
    var path = require('path');

    var stripComments = /<\!--.*?-->/g,
        collapseWhiteSpace = /\s+/g;

    grunt.initConfig({
        dojo: {
            dist: {
                options: {
                    dojo: path.join('src', 'dojo', 'dojo.js'),
                    dojoConfig: 'config.js',
                    profile: 'profile.js',
                    releaseDir: 'dist',
                    basePath: path.join(__dirname, 'src')
                }
            }
        },
        connect: {
            options: {
                port: 8888,
                hostname: 'localhost'
            },
            test: {
                options: {
                    base: 'src'
                }
            },
            dist: {
                options: {
                    base: 'dist'
                }
            }
        },
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        'dist'
                    ]
                }]
            }
        },
		intern: {
			local: {
				options: {
					runType: 'client',
					config: 'src/Home/tests/intern'
				}
			},
			remote: {
				options: {
					runType: 'runner',
					config: 'src/Home/tests/intern'
				}
			}
		}
	});

	grunt.registerTask('default', []);
	grunt.registerTask('server', function (target) {
		if (target === 'dist') {
			return grunt.task.run([
				'build',
				'connect:dist:keepalive'
			]);
		}

		grunt.task.run([
			'connect:test:keepalive'
		]);
	});
	grunt.registerTask('build', [ 'clean', 'dojo:dist', 'copy' ]);
};
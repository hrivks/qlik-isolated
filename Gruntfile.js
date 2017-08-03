module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
	uglify: {
      options: {
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> | ' 
			+'<%= grunt.template.today("yyyy-mm-dd") %>\n'
			+' * <%= pkg.author %> | <%= pkg.license %> License | <%= pkg.homepage %> */'
      },
      build: {
        src: 'src/<%= pkg.name %>.js',
        dest: '<%= pkg.name %>.min.js'
      }
    },
	jsdoc : {
        dist : {
            src: ['src/*.js'],
            options: {
                destination: 'doc'
            }
        }
    },
	'string-replace': {
		dist: {
			files: {
			  './': '<%= pkg.name %>.min.js',
			  'doc/': 'doc/*.html'
			},
			options: {
			  replacements: [{
				pattern:  /{{VERSION}}/g,
				replacement: '<%= pkg.version %>'
			  }]
			}
		}
	}
  });

  // load plugins
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-string-replace');
  grunt.loadNpmTasks('grunt-jsdoc');

  // Default task(s).
  grunt.registerTask('default', ['uglify', 'jsdoc' ,'string-replace']);

};
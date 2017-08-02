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
        dest: 'build/<%= pkg.name %>.min.js'
      }
    },
	'string-replace': {
		dist: {
			files: {
			  'build/': 'build/*.js',
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

  // Default task(s).
  grunt.registerTask('default', ['uglify', 'string-replace']);

};
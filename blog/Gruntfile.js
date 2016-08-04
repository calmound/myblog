module.exports = function(grunt){
	
	
	grunt.initConfig({
		//pkg:grunt.file.readJSON('package.json'),
		watch:{
			ejs:{
				files:['views/**'],
				options:{
					livereload:true
				}
			},
			js:{
				files:['public/js/**'],
				options:{
					livereload:true
				}
			}
		},
		nodemon:{
			dev: {
			    script: 'app.js',
			    options: {
					args: [''],
					nodeArgs: ['--debug'],
					env: {
						PORT: '3000'
					},
					cwd: __dirname,
					ignore: ['node_modules/**'],
					ext: 'js',
					watch: ['./'],
					delay: 1000,
					//legacyWatch: true
				}
			}
		},
		concurrent:{
			target:{
				tasks:['nodemon','watch'],
				options:{
					logConcurrentOutput:true
				}
			}
		}
	});
	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-nodemon');
	
	
	grunt.option('force',true);
	
	grunt.registerTask('default',['concurrent']);
}

module.exports=function(grunt){
	grunt.initConfig({
		pkg:grunt.file.readJSON('package.json'),
		watch:{
			bulid:{
				files:['views/*.ejs','app/controller/*.js','app/routes/*.js'],
				option:{ spawn:false}
			}
		}
	});
	grunt.loadNpmTasks('grunt-contrib-watch');
	//输入grunt时需要做什么
	grunt.registerTask('default',['watch']);
}
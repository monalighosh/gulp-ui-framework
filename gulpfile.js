var gulp = require("gulp");
var cssnano = require("cssnano");
var autoprefixer = require("autoprefixer");
var browserSync = require("browser-sync").create();
var runSequence = require('run-sequence');
var plugins = require("gulp-load-plugins")({
	scope: ["devDependencies"]
});

//Js tasks
//Lints, uglifies, tests
gulp.task("scripts", function(){
	return gulp.src("javascripts/*.js")
	.pipe(plugins.jshint())
	.pipe(plugins.uglify())
	.pipe(gulp.dest("build/js"))
	.pipe(browserSync.reload({
      stream: true
    }));
});

//CSS tasks
//Sass
gulp.task("sass", function(){
	return gulp.src("stylesheets/**/*.scss")
	.pipe(plugins.sass())
	.pipe(plugins.csslint())
	.pipe(plugins.csslint.formatter())
	.pipe(gulp.dest("css"))
	.pipe(browserSync.reload({
		stream: true
	}));
});

//Lints, minifies, autoprefixes
gulp.task("styles", function(){
	var processors = [cssnano, autoprefixer];

	return gulp.src("css/*.css")
	.pipe(plugins.csslint())
	.pipe(plugins.postcss(processors))
	.pipe(gulp.dest("build/css"));
});

//HTML tasks
//Validates, lints
gulp.task("html", function(){
	return gulp.src(["index.html", "components/*.html"])
	pipe(plugins.validator())
	pipe(plugins.htmllint())
	pipe(gulp.dest("./"));
});

//Images
//Compresses
gulp.task("images", function(){
	return gulp.src("images/**/*")
	.pipe(plugins.imagemin())
	.pipe(gulp.dest("build/images"));
});

//BrowserSync
gulp.task("browserSync", function() {
  browserSync.init({
    server: {
      baseDir: "./"
    },
  })
})

//Versioning
gulp.task("bump", function(){
	return gulp.src("package.json")
	.pipe(plugins.bump())
	.pipe(gulp.dest("./"))
});

//Git tasks
//Git add
gulp.task("add", function(){
	return gulp.src(["index.html", "gulpfile.js", "package.json", "components/*", "build"])
	.pipe(plugins.git.add());
});

//Git commit
gulp.task("commit", function(){
	var pjson = require('./package.json');
	return gulp.src(["index.html", "gulpfile.js", "package.json", "components/*", "build"])
	.pipe(plugins.git.commit("Commiting version " + pjson.version));
});

//Git push
gulp.task("push", function(){
  plugins.git.push("origin", "master", function(err) {
    if (err) throw err;
  });
});

//Watch tasks
//Watches sass and js
gulp.task("watch", ["browserSync", "sass", "scripts"], function(){
	gulp.watch("stylesheets/**/*.scss", ["sass"]);
	gulp.watch("javascripts/*.js", ["scripts"]);
	gulp.watch("*.html", browserSync.reload); 

})

//Default Task
gulp.task("default", function(cb){
	runSequence("scripts", "sass", "watch", "styles", "html", cb);
	console.log("Gulp is building files");
});

//Git Publishing task
gulp.task("git", function(cb){
	runSequence("add", "commit", "push", cb);
	console.log("Publishing to git")
});

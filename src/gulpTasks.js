const gulp = require("gulp");
const quickCommit = require("./script/quickCommit");
const reconfig = require("./script/reconfig");

gulp.task("commit", quickCommit);
gulp.task("reconfig", reconfig);

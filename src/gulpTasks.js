const gulp = require("gulp");
const quickCommit = require("./scripts/quickCommit");
const reconfig = require("./scripts/reconfig");
const publish = require("./scripts/publish");

gulp.task("commit", quickCommit);
gulp.task("reconfig", reconfig);
gulp.task("publish", publish);

const gulp = require("gulp");
const quickCommit = require("./scripts/quickCommit");
const reconfig = require("./scripts/reconfig");
const publish = require("./scripts/publish");
const clist = require("./scripts/clist");

gulp.task("commit", quickCommit);
gulp.task("rename", reconfig);
gulp.task("publish", publish);
gulp.task("clist", clist);

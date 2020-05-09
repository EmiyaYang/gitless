#!/usr/bin/env node

const gulp = require("gulp");
const program = require("commander");
require("./gulpTasks");

program.name("run").usage(`[task name]
Available tasks: 
  1. commit: 快速提交
  2. rename: 重命名指定分支
  3. publish: 包发布
  4. clist 获取提交者列表`);

program.parse(process.argv);
const task = program.args[0];

if (!task) {
  program.help((str) => str);
} else {
  console.log("Emiya run:", task);

  runTask(task);
}

function runTask(toRun) {
  const metadata = { task: toRun };
  // Gulp >= 4.0.0 (doesn't support events)
  const taskInstance = gulp.task(toRun);
  if (taskInstance === undefined) {
    gulp.emit("task_not_found", metadata);
    return;
  }
  const start = process.hrtime();
  gulp.emit("task_start", metadata);
  try {
    taskInstance.apply(gulp);
    metadata.hrDuration = process.hrtime(start);
    gulp.emit("task_stop", metadata);
    gulp.emit("stop");
  } catch (err) {
    err.hrDuration = process.hrtime(start);
    err.task = metadata.task;
    gulp.emit("task_err", err);
  }
}

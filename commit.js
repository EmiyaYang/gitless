const inquirer = require("inquirer");
const { execSync } = require("child_process");

const msg = execSync("git status", { encoding: "utf8" });

msg.match(/(Changes not staged for commit)|(Changes to be committed)/);

if (msg && msg.length) {
  console.log("请先提交!");
} else {
  console.log("不用提交了!");
}

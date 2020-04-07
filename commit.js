const inquirer = require("inquirer");
const { execSync } = require("child_process");

const msg = execSync("git status", { encoding: "utf8" });

const matched = msg.match(
  /(Changes not staged for commit)|(Changes to be committed)/
);

console.log(matched);
if (matched && matched.length) {
  console.log("请先提交!");
} else {
  console.log("不用提交了!");
}

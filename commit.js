const inquirer = require("inquirer");
const { execSync } = require("child_process");

module.exports = async function() {
  const msg = execSync("git status", { encoding: "utf8" });

  const matched = msg.match(
    /(Changes not staged for commit)|(Changes to be committed)/
  );

  if (!matched || !matched.length) return;

  const { message } = await inquirer.prompt([
    {
      message: "请输入提交信息",
      type: "input",
      name: "message",
      default: "test: some changes",
      validate: value =>
        new Promise(resolve => {
          setTimeout(() => resolve(!!value || "请输入有效的提交信息"), 100);
        })
    }
  ]);

  execSync(`git add .`, { stdio: "inherit", encoding: "utf8" });
  execSync(`git commit -m '${message}'`, {
    stdio: "inherit",
    encoding: "utf8"
  });
};

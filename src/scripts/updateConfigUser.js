const inquirer = require("inquirer");
const { execSync } = require("child_process");

module.exports = async function({ newName, newEmail }) {
  const currentName = execSync("git config user.name", {
    encoding: "utf8"
  }).trim();

  const currentEmail = execSync("git config user.email", {
    encoding: "utf8"
  }).trim();

  if (currentName === newName && currentEmail === newEmail) {
    // 无变更
    return;
  }

  // 询问是否更新到 config.user
  const { ifReplace } = await inquirer.prompt([
    {
      message: "是否替换为 git config user?",
      type: "list",
      default: false,
      choices: [
        { name: "y", value: true },
        { name: "N", value: false }
      ]
    }
  ]);

  if (!ifReplace) return;

  execSync(`git config user.name ${newName}`, {
    stdio: "inherit",
    encoding: "utf8"
  });

  execSync(`git config user.email ${newEmail}`, {
    stdio: "inherit",
    encoding: "utf8"
  });
};

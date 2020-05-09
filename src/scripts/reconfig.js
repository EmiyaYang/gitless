const inquirer = require("inquirer");
const { execSync } = require("child_process");
const commitTask = require("./quickCommit");
const updateConfigUser = require("./updateConfigUser");
const getCurrentBranch = require("./getCurrentBranch");
const getCommitterList = require("./getCommitterList");

module.exports = async function () {
  const currentName = execSync("git config user.name", {
    encoding: "utf8",
  }).trim();

  const currentEmail = execSync("git config user.email", {
    encoding: "utf8",
  }).trim();

  const account = getCommitterList();

  // 先判断是否有未提交的变更
  await commitTask();

  getCurrentBranch();

  console.log("警告:", `该 cli 将会自动覆盖 git 相关备份`);

  const { oldEmail, name, email } = await inquirer.prompt([
    {
      message: "请选择要替换的旧邮箱",
      type: "list",
      name: "oldEmail",
      choices: account.map((item) => item.email),
    },
    {
      message: "请输入新的用户名",
      type: "input",
      name: "name",
      default: currentName,
      validate: (value) =>
        new Promise((resolve) => {
          setTimeout(() => resolve(!!value || "请输入有效的用户名"), 100);
        }),
    },
    {
      message: "请输入新的邮箱",
      type: "input",
      name: "email",
      default: currentEmail,
      validate: (value) =>
        new Promise((resolve) => {
          // TODO: 邮箱格式校验
          setTimeout(() => resolve(!!value || "请输入有效的邮箱"), 100);
        }),
    },
  ]);

  const command = `'
      OLD_EMAIL=${oldEmail}
      CORRECT_NAME=${name}
      CORRECT_EMAIL=${email}
      if test "$GIT_COMMITTER_EMAIL" = "$OLD_EMAIL"
      then
          export GIT_COMMITTER_NAME="$CORRECT_NAME"
          export GIT_COMMITTER_EMAIL="$CORRECT_EMAIL"
      fi
      if test "$GIT_AUTHOR_EMAIL" = "$OLD_EMAIL"
      then
          export GIT_AUTHOR_NAME="$CORRECT_NAME"
          export GIT_AUTHOR_EMAIL="$CORRECT_EMAIL"
      fi
      '`;

  try {
    // 自动删除备份
    // execSync(`git update-ref -d refs/original/refs/heads/${currentBranch}`);
    execSync(
      'git for-each-ref --format="%(refname)" refs/original/ | xargs -n 1 git update-ref -d'
    );

    execSync(
      `git filter-branch --env-filter ${command} --tag-name-filter cat -- --branches --tags`,
      { stdio: "inherit", encoding: "utf8" }
    );

    // 询问是否更新 config.user
    await updateConfigUser({ newName: name, newEmail: email });
  } catch (e) {
    console.log("错误信息如下: \n");
    console.log("--------------------------------");
    console.warn(e);
  }
};

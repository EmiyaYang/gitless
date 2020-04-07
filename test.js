const inquirer = require("inquirer");
const { execSync } = require("child_process");

const currentName = execSync("git config user.name", {
  encoding: "utf8"
}).trim();

const currentEmail = execSync("git config user.email", {
  encoding: "utf8"
}).trim();

const str = execSync("git log", { encoding: "utf8" });

const reg = /Author:\s?(\w+)\s?<([^>]+)>/g;

let account = [];

str.replace(reg, (str, name, email) => {
  // side effect

  // 去重
  if (account.find(item => item.email === email)) return;

  account.push({
    name,
    email
  });
});

(async () => {
  const { oldEmail } = await inquirer.prompt([
    {
      message: "请选择要替换的旧邮箱",
      type: "list",
      name: "oldEmail",
      choices: account.map(item => item.email)
    }
    // {
    //   message: "是否替换为当前 git config?",
    //   type: "list",
    //   name: "ifReplace",
    //   choices: [
    //     { name: "y", value: true },
    //     { name: "N(手动输入)", value: false }
    //   ]
    // }
  ]);

  const newUser = await inquirer.prompt([
    {
      message: "请输入新的用户名",
      type: "input",
      name: "name",
      default: currentName,
      validate: value =>
        new Promise(resolve => {
          setTimeout(() => resolve(!!value || "请输入有效的用户名"), 1000);
        })
    },
    {
      message: "请输入新的邮箱",
      type: "input",
      name: "email",
      default: currentEmail,
      validate: value =>
        new Promise(resolve => {
          // TODO: 邮箱格式校验
          setTimeout(() => resolve(!!value || "请输入有效的邮箱📮"), 1000);
        })
    }
  ]);

  const command = `'
    OLD_EMAIL=${oldEmail}
    CORRECT_NAME=${newUser.name}
    CORRECT_EMAIL=${newUser.email}
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
    const msg = execSync(
      `git filter-branch --env-filter ${command} --tag-name-filter cat -- --branches --tags`,
      { stdio: "inherit", encoding: "utf8" }
    );
  } catch (e) {
    console.log("错误信息如下: \n");
    console.log("--------------------------------");
    console.warn(e);
  }
})();

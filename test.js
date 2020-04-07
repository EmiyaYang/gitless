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

const account = [];

str.replace(reg, (str, name, email) => {
  // side effect
  account.push({
    name,
    email
  });
});

console.log(account);

(async () => {
  const { oldEmail, ifReplace } = await inquirer.prompt([
    {
      message: "请选择要替换的旧邮箱",
      type: "list",
      name: "oldEmail",
      choices: account.map(item => item.email)
    },
    {
      message: "是否替换为当前 git config?",
      type: "list",
      name: "ifReplace",
      choices: [
        { name: "y", value: true },
        { name: "N(手动输入)", value: false }
      ]
    }
  ]);

  if (ifReplace) {
  }
})();

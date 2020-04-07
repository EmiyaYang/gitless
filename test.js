const inquirer = require("inquirer");
const { execSync } = require("child_process");

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
  const result = await inquirer.prompt([
    {
      type: "list",
      name: "oldEmail",
      message: "请选择要替换的旧邮箱",
      choices: account.map(item => item.email)
    }
  ]);
})();

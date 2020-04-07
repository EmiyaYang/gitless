const inquirer = require("inquirer");
const { execSync } = require("child_process");

console.log("将要快速修改 commit 信息");

console.log("git config user:");
const email = execSync("git config user.email");
const name = execSync("git config user.name");

console.log(`name: ${name}`);
console.log(`email: ${email}`);

(async () => {
  answer = await inquirer.prompt([
    {
      message: ""
    }
  ]);
})();

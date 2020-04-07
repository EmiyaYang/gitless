const inquirer = require("inquirer");
const { execSync } = require("child_process");
const quickCommit = require("./quickCommit");

const questions = [
  {
    type: "list",
    name: "level",
    message: "发什么等级?",
    choices: ["patch", "minor", "major"],
    filter: function(val) {
      return val.toLowerCase();
    }
  }
  // {
  //   type: "list",
  //   name: "pack",
  //   message: "用什么打包方式?",
  //   choices: [
  //     { name: "自定义", value: "comp" },
  //     {
  //       name: "vue-cli3 库模式",
  //       value: "build:lib"
  //     }
  //   ],
  //   filter: function(val) {
  //     return val.toLowerCase();
  //   }
  // }
];

module.exports = async function() {
  // 检测git工作树, 如未清空则自动生成提交
  await quickCommit({ defaultMessage: "chore: publish" });

  const { level } = await inquirer.prompt(questions);

  try {
    // execSync(`yarn ${pack}`, { stdio: "inherit" });

    // 发布前要清空工作树, 这个错误被捕获但没有打印出日志
    execSync(`npm version ${level}`, { stdio: "inherit" });

    execSync("npm publish", { stdio: "inherit" });

    console.log("发布成功!");
  } catch (e) {
    console.log("发布失败! 错误信息如下: \n");
    console.log("--------------------------------");
    console.warn(e);
  }
};

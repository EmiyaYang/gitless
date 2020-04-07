const { execSync } = require("child_process");

module.exports = function() {
  const str = execSync("git branch", { encoding: "utf8" });

  return str.replace(/\* (\w+)/, "$1").trim();
};

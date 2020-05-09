const { execSync } = require("child_process");

function getCommitterList() {
  const account = [];

  const str = execSync("git log", { encoding: "utf8" });

  // @ts-ignore
  str.replace(/Author:\s?([\S^<]+)\s?<([^>]+)>/g, (str, name, email) => {
    // side effect

    // 去重
    if (account.find((item) => item.email === email)) return;

    account.push({
      name,
      email,
    });
  });

  return account;
}

module.exports = {
  getCommitterList,
};

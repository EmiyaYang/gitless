const { getCommitterList } = require("../utils");

module.exports = async function () {
  const arr = getCommitterList();

  arr.forEach((item, index) => {
    console.log(index + 1, item.name, item.email);
  });
};

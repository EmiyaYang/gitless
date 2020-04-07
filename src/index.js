const program = require("commander");

program.parse(process.argv);
const task = program.args[0];

const taskMap = [{}];

if (!task) {
  program.help();
} else {
  console.log("Emiya run:", task);

  runTask(task);
}

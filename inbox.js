const program = require("commander");

program
  .command("commit")
  .alias("c")
  .description("快速提交: add + commit")
  .action((source, destination) => {
    console.log("clone command called", source, destination);
  });

// <>: required, []: optional
program
  .command("start2 <service>")
  .description("clone a repository into a newly created directory")
  .action((service) => {
    console.log("start2");
  });

program.parse(program.argv);

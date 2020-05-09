const program = require("commander");

const quickCommit = require("./scripts/quickCommit");
const reconfig = require("./scripts/reconfig");
const publish = require("./scripts/publish");
const clist = require("./scripts/clist");

program
  .command("commit")
  .alias("c")
  .description("快速提交: add + commit")
  .action(() => {
    quickCommit();
  });

program
  .command("clist")
  .alias("cl")
  .description("获取提交者列表")
  .action(clist);

// <>: required, []: optional
program.command("rename").description("批量重命名分支").action(reconfig);

program.command("publish").alias("pub").description("快速发布").action(publish);

program.parse(program.argv);

const path = require("path");
const rimraf = require("rimraf");
const gulp = require("gulp");
const through2 = require("through2");
const merge2 = require("merge2");
const babel = require("gulp-babel");
const getBabelCommonConfig = require("./getBabelCommonConfig");
const cwd = process.cwd();
const libDir = path.join(cwd, "lib");
// const esDir = path.join(cwd, "es");

function compile() {
  // rm -rf
  rimraf.sync(libDir);

  const assetsStream = gulp
    .src(["src/components/**/*.@(png|svg)"])
    .pipe(gulp.dest(libDir));

  const lessStream = gulp
    .src(["src/components/**/*.less"])
    .pipe(gulp.dest(libDir));

  const jsFilesStream = babelify(
    gulp.src([
      "src/components/index.js",
      "src/components/style.js",
      "src/components/**/*.js",
      "src/components/**/*.jsx",
      "!src/components/*/__tests__/*"
    ])
  );

  // Merge multiple streams into one stream in sequence or parallel.
  return merge2([jsFilesStream, assetsStream, lessStream]);
}

function babelify(js) {
  const babelConfig = getBabelCommonConfig(false);
  babelConfig.babelrc = false;
  delete babelConfig.cacheDirectory;
  // if (modules === false) {
  //   babelConfig.plugins.push(replaceLib);
  // }
  let stream = js.pipe(babel(babelConfig)).pipe(
    through2.obj(function z(file, encoding, next) {
      this.push(file.clone());
      next();
      // if (file.path.match(/\/style\/index\.(js|jsx)$/)) {
      //   const content = file.contents.toString(encoding);
      //   file.contents = Buffer.from(
      //     content
      //       // .replace(/\/style\/?'/g, "/style/css'")
      //       .replace(/\.less/g, ".css")
      //   );
      //   file.path = file.path.replace(/index\.(js|jsx)$/, "css.js");
      //   this.push(file);
      //   next();
      // } else {
      //   next();
      // }
    })
  );
  return stream.pipe(gulp.dest(libDir));
}

gulp.task(
  "compile",
  gulp.series(done => {
    compile().on("finish", function() {
      done();
    });
  })
);

// 用于阻止一些行为
// WARNING: 不能阻止yarn
gulp.task(
  "guard",
  gulp.series(next => {
    const npmArgs = getNpmArgs();
    if (npmArgs) {
      for (let arg = npmArgs.shift(); arg; arg = npmArgs.shift()) {
        if (
          /^pu(b(l(i(sh?)?)?)?)?$/.test(arg) &&
          // /^lint$/.test(arg) &&
          npmArgs.indexOf("--with-run-tools") < 0
        ) {
          next(1);
          return;
        }
      }
    }

    next();
  })
);

gulp.on("task_not_found", () => {
  console.log("没有该任务");
});

function getNpmArgs() {
  let npmArgv = null;

  try {
    npmArgv = JSON.parse(process.env.npm_config_argv);
  } catch (err) {
    return null;
  }

  if (
    typeof npmArgv !== "object" ||
    !npmArgv.cooked ||
    !Array.isArray(npmArgv.cooked)
  ) {
    return null;
  }

  return npmArgv.cooked;
}

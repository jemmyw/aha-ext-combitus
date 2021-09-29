const esbuild = require("esbuild");
const vuePlugin = require("./esbuild-vue/src/index");
const c = require("child_process");

function runInstall() {
  c.spawnSync(
    "../../aha-cli/bin/run",
    ["extension:install", "-s", process.env.SUBDOMAIN],
    {
      stdio: ["pipe", process.stdout, process.stderr],
    }
  );
}

esbuild
  .build({
    entryPoints: ["src/views/attribute/index.ts"],
    outfile: "dist/bundle.js",
    bundle: true,
    format: "esm",
    target: ["es2020"],
    plugins: [vuePlugin({ shadowMode: true })],
    watch: {
      onRebuild(error, result) {
        if (error) {
          console.error("watch build failed:", error);
          return;
        }

        runInstall();
      },
    },
  })
  .then(() => {
    runInstall();
  });

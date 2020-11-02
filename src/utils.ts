import * as childProcess from "child_process";
import * as path from "path";
import * as os from "os";

export function isBuildToolsInstalled() {
  const result = childProcess.spawnSync(
    os.platform() === "win32" ? "where" : "which",
    ["electron-build-tools"]
  );

  return result.status === 0;
}

export function getConfigs() {
  const configs: string[] = [];
  let activeConfig = null;

  const configsOutput = childProcess
    .execSync("electron-build-tools show configs", { encoding: "utf8" })
    .trim();

  for (const rawConfig of configsOutput.split("\n")) {
    const config = rawConfig.replace("*", "").trim();
    configs.push(config);

    if (rawConfig.trim().startsWith("*")) {
      activeConfig = config;
    }
  }

  return { configs, activeConfig };
}

export function getConfigsFilePath() {
  return path.join(os.homedir(), ".electron_build_tools", "configs");
}

export function killThemAll(cp: childProcess.ChildProcess) {
  if (os.platform() === "win32") {
    // Kill the child processes or they'll keep running
    childProcess.spawn("taskkill", ["/pid", cp.pid.toString(), "/f", "/t"]);
  } else {
    cp.kill("SIGINT");
  }
}

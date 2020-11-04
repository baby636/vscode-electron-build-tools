import * as net from "net";
import * as readline from "readline";

import * as vscode from "vscode";

import { generateSocketName } from "./utils";

type ElectronBuildToolsTask = {
  onDidWriteLine: vscode.Event<OnDidWriteLine>;
};

type OnDidWriteLine = {
  progress: vscode.Progress<{
    message?: string | undefined;
    increment?: number | undefined;
  }>;
  line: string;
};

export function runAsTask(
  operationName: string,
  taskName: string,
  command: string,
  shellOptions?: vscode.ShellExecutionOptions,
  exitCodeHandler?: (exitCode: number) => boolean | undefined
): ElectronBuildToolsTask {
  const socketName = generateSocketName();

  const task = new vscode.Task(
    { type: "electron-build-tools", task: taskName },
    vscode.workspace.workspaceFolders![0],
    taskName,
    "electron-build-tools",
    new vscode.ShellExecution(
      `node echo-to-socket.js "${command}" ${socketName}`,
      { cwd: __dirname, ...shellOptions }
    ),
    "$electron"
  );

  // TODO - How to stop the terminal from being closed on task cancel?
  task.presentationOptions = {
    reveal: vscode.TaskRevealKind.Silent,
    echo: false,
    clear: true,
  };

  const socketServer = net.createServer().listen(socketName);

  const onDidWriteLineEmitter = new vscode.EventEmitter<OnDidWriteLine>();

  const wrappedTask: ElectronBuildToolsTask = {
    onDidWriteLine: onDidWriteLineEmitter.event,
  };

  vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: operationName.split("-")[1].trim(),
      cancellable: true,
    },
    async (progress, token) => {
      socketServer.on("connection", (socket) => {
        const rl = readline.createInterface({
          input: socket,
        });

        rl.on("line", (line) => onDidWriteLineEmitter.fire({ progress, line }));
      });

      const taskExecution = await vscode.tasks.executeTask(task);

      return new Promise(async (resolve, reject) => {
        socketServer.on("error", () => reject("Socket server error"));

        vscode.tasks.onDidEndTask(({ execution }) => {
          if (execution === taskExecution) {
            resolve();
          }
        });

        vscode.tasks.onDidEndTaskProcess(({ execution, exitCode }) => {
          if (execution === taskExecution && exitCode && exitCode !== 0) {
            const handled = exitCodeHandler ? exitCodeHandler(exitCode) : false;

            if (!handled) {
              vscode.window.showErrorMessage(
                `'${operationName}' failed with exit code ${exitCode}`
              );
            }
          }
        });

        token.onCancellationRequested(() => {
          resolve();
          taskExecution.terminate();
          console.warn(`User canceled '${command}'`);
        });
      }).finally(() => taskExecution.terminate());
    }
  );

  return wrappedTask;
}
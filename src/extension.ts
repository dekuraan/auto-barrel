import * as vscode from "vscode";

import { CreateBarrelCommandHandler } from "./create-barrel-command-handler";
import { StartCommandHandler } from './start-command-handler';

let fileSystemWatcher: vscode.FileSystemWatcher;

export function activate(context: vscode.ExtensionContext) {
  const createBarrelCommand = vscode.commands.registerCommand(
    "autoBarrel.createBarrel",
    CreateBarrelCommandHandler.execute
  );

  const startCommand = vscode.commands.registerCommand(
    "autoBarrel.start",
    () => {
      const watchGlob =
        vscode.workspace
          .getConfiguration("autoBarrel")
          .get<string>("watchGlob") || "**/src/**/*.[tj]s";
      fileSystemWatcher = vscode.workspace.createFileSystemWatcher(watchGlob, false, true, false);
      fileSystemWatcher.onDidCreate(StartCommandHandler.handleFileAdded);
      fileSystemWatcher.onDidDelete(StartCommandHandler.handleFileDeleted);
    }
  );

  context.subscriptions.push(createBarrelCommand);
  context.subscriptions.push(startCommand);
}

export function deactivate() {
  if (typeof fileSystemWatcher !== "undefined") {
    fileSystemWatcher.dispose();
  }
}

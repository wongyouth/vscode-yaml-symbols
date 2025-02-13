import * as vscode from 'vscode';
import { currentKeyPath } from './util';
import { getConfig } from './config';

let statusBarItem: vscode.StatusBarItem;

export function createStatusItem(context: vscode.ExtensionContext) {
  if (!getConfig().showKeyPathInStatusBar) {
    return;
  }

  // Create status bar item
  statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
  statusBarItem.command = 'yaml-outline.copyKeyPath';
  context.subscriptions.push(statusBarItem);

  // Update status bar when active editor changes
  vscode.window.onDidChangeActiveTextEditor(updateStatusBarItem, null, context.subscriptions);

  // Update status bar when selection changes
  vscode.window.onDidChangeTextEditorSelection(
    (event) => updateStatusBarItem(event.textEditor),
    null,
    context.subscriptions
  );

  // Update status bar when text changes
  vscode.workspace.onDidChangeTextDocument(
    (event) => {
      if (
        vscode.window.activeTextEditor &&
        event.document === vscode.window.activeTextEditor.document
      ) {
        updateStatusBarItem(vscode.window.activeTextEditor);
      }
    },
    null,
    context.subscriptions
  );

  // Update status bar for current editor
  updateStatusBarItem(vscode.window.activeTextEditor);
}

function updateStatusBarItem(editor: vscode.TextEditor | undefined): void {
  const key = currentKeyPath(editor);

  if (key) {
    statusBarItem.text = key;
    statusBarItem.show();
  } else {
    statusBarItem.hide();
  }
}

export function disposeStatusItem() {
  statusBarItem?.dispose();
}

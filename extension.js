// Code for the plugin in vscode
const vscode = require('vscode');
const axios = require('axios');

function activate(context) {
    let disposable = vscode.commands.registerCommand('extension.getStarcoderOutput', function () {
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            return; // No open text editor
        }

        let selection = editor.selection;
        let text = editor.document.getText(selection);

        // If no text is selected, get the text of the current line
        if (text === '') {
            let lineNumber = selection.active.line;
            text = editor.document.lineAt(lineNumber).text;
        }

        axios.post('SERVER URL', text)
        .then(function (response) {
            let outputText = response.data;
            // Use selection.active to insert at the current position instead of the start of the selection
            editor.edit((editBuilder) => {
                editBuilder.insert(selection.active, outputText);
            });
        })
        .catch(function (error) {
            console.log(error);
            vscode.window.showErrorMessage("Error communicating with StarCoder server.");
        });
    });

    context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};

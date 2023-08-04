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
        
        // Format the text in the desired JSON format
        let formattedText = {
            "prompt": text,
            "inference_type": "SUMMARIZATION"
        };

        axios.post('https://codebear.llm.dev.sparkcognition.dev/api/v1/inference', formattedText)
        .then(function (response) {
            let fullText = response.data.response.generated_text;
            let outputText = '\n' + fullText.split('\n').slice(1).join('\n'); // Add a newline right after the removed prompt
            
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

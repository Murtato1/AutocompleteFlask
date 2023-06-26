# AutocompleteFlask

app.py - The python code that runs the flask server and loads the starcoder model. Requests are posted to this server and it returns the output from starcoder
extension.js - The code for the extension in vscode. This is what interacts with the server and sends it the code from the user's side. 
Dockerfile - the dockerfile used to build app.py into a docker image

Commands I used to build and run the docker image:
sudo docker build -t deploy_flask .
sudo docker run -p 5000:5000 deploy_flask .

***app.py requires starcoder to  be in its local folder and in a folder named 'starcoder'
The download link for starcoder is here: https://huggingface.co/bigcode/starcoder

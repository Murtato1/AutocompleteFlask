# Python code running a flask server for autocomplete
# Is used in the docker image

# Importing necessary libraries
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch
import torch.nn as nn
from flask import Flask, request

# Create an instance of a Flask app
app = Flask(__name__)

# Determine the device to use. This will be "cuda" if a GPU is available, otherwise it will be "cpu".
device = "cuda" if torch.cuda.is_available() else "cpu"

# Load the tokenizer from the local directory "./starcoder". 
# The device_map is set to 'auto', so the transformers library will automatically select the best device (CPU or GPU) for running the model.
tokenizer = AutoTokenizer.from_pretrained("./starcoder", device_map = 'auto')

# Load the model from the local directory "./starcoder". 
# The model is loaded with 8-bit (quantized) precision for faster inference (load_in_8bit = True) and uses 16-bit floating point numbers for computations (torch_dtype=torch.float16).
model = AutoModelForCausalLM.from_pretrained("./starcoder", device_map = 'auto', load_in_8bit = True, torch_dtype=torch.float16)

# Define the main route ('/') that accepts POST requests. 
@app.route('/', methods=['POST'])
def generate_text():
    # Get the text from the incoming request.
    text = request.get_data(as_text=True)

    # Encode the text using the tokenizer, and send the resulting tensor to the selected device.
    inputs = tokenizer.encode(text, return_tensors="pt").to(device)

    # Generate new text based on the input, with a maximum length of 60 tokens.
    outputs = model.generate(inputs, max_new_tokens=60, pad_token_id=tokenizer.eos_token_id)

    # Print the generated text to the console (this may be useful for debugging).
    print(outputs)

    # Decode the generated text and return it.
    generated_text = tokenizer.decode(outputs[0], clean_up_tokenization_spaces=True)
    return generated_text
    
# Define a test route that simply returns a message indicating that the server is running.
@app.route('/test')
def hello():
    return 'Server is up'

# If this script is run directly (not imported as a module), start the Flask app.
if __name__ == '__main__':
    app.run()

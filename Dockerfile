# Use Python 3.8 as base image
FROM python:3.8

# Set working directory in the Docker image
WORKDIR /app

# Copy local files to the Docker image
COPY . /app

# Install PyTorch
RUN pip install torch==1.10.0

RUN pip install bitsandbytes==0.39.0

# Install other necessary packages
RUN pip install transformers flask accelerate scipy

# Expose the necessary port
EXPOSE 5000

# Run the application
ENTRYPOINT FLASK_APP=./app.py flask run --host=0.0.0.0

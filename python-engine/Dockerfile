# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container
COPY python-engine/requirements.txt .

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY python-engine/ .

# Expose the port the app runs on
EXPOSE 5000

# Run the python engine directly
# We use python app.py instead of gunicorn because app.py initiates a background thread
CMD ["python", "app.py"]

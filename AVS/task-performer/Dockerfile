# Production python service
FROM python:3.9-slim
# Install dependencies

COPY requirements.txt /app/requirements.txt
WORKDIR /app
RUN pip install -r requirements.txt
# Copy the current directory contents into the container at /app
COPY . /app
# Make port 80 available to the world outside this container
EXPOSE 4003
# Define environment variable
ENV NAME execution-service
# Run app.py when the container launches
CMD ["python", "main.py"]
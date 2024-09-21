FROM python:3.11-slim-buster

COPY requirements.txt ./

COPY .env ./app/

RUN pip install -r requirements.txt

COPY main.py ./app/

WORKDIR /app

EXPOSE 8000

ENTRYPOINT ["python", "main.py"]
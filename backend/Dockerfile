FROM python:3.11.0

RUN mkdir app
WORKDIR /app

ENV PATH="${PATH}:/root/.local/bin"
ENV PYTHONPATH=.

COPY r.txt .
RUN pip install --upgrade pip
RUN pip install -r r.txt

COPY src/ .
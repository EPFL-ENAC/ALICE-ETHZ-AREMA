# FastAPI
Based loosely on https://github.com/gauravgola96/FastAPI-Example

## Requirements
- python 3.10.9
- poetry
- Make
- Docker with docker compose
- OS:
  - Windows: docker desktop with wsl
  - Apple: with docker desktop dependencies installed via brew
  - Linux: libwebp-dev

## How to run
API for uploading object(.png|.jpg) to S3 bucket asynchronously
-> convert png or jpg to webp files

Create a file .env and put all s3 credential here
```
.env
```
s3 credentials 

```
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
S3_REGION = 
S3_Bucket = 
S3_Key = 

```


Run Locally
```
make install; make run
```

Swagger docs
```
http://0.0.0.0:5050/docs
```

To provide .env use Dockerfile.
```
Path : ./Dockerfile
```

## Install
Don't forget to install libwebp-dev on the machine (cf Dockerfile)

FROM ubuntu:20.04

RUN apt-get update && \
    apt-get install -y nodejs && \
    apt-get install -y npm && \
    apt-get install -y net-tools && \
    apt-get install -y nano && \
    apt-get install -y curl && \
    apt-get install -y sudo

WORKDIR /app

COPY . /app

EXPOSE 8080
#for non openshift builds
USER root

CMD ["npm","run","dev"]
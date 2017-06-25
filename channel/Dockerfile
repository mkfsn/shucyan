FROM golang:1.8
MAINTAINER mkfsn<p408865@gmail.com>

RUN go get -u github.com/kardianos/govendor


RUN mkdir -p /go/src/app/vendor
WORKDIR /go/src/app
COPY vendor/vendor.json /go/src/app/vendor/
RUN govendor sync

COPY . /go/src/app

RUN mkdir -p /go/src/github.com/mkfsn/shyuukan-program && \
    ln -sfv /go/src/app /go/src/github.com/mkfsn/shyuukan-program/channel

ARG build_env=production
RUN go-wrapper install -tags $build_env

CMD ["go-wrapper", "run", "-port", "7071", "-ip", "0.0.0.0"]

EXPOSE 7071

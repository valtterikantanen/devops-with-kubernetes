FROM alpine:3.20

RUN apk --no-cache add curl

WORKDIR /app

COPY script.sh .

RUN chmod +x script.sh

ENTRYPOINT ["./script.sh"]

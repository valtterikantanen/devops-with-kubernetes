FROM google/cloud-sdk:slim

# Instructions from https://www.postgresql.org/download/linux/debian/
RUN install -d /usr/share/postgresql-common/pgdg

RUN curl -o /usr/share/postgresql-common/pgdg/apt.postgresql.org.asc --fail https://www.postgresql.org/media/keys/ACCC4CF8.asc

RUN echo "deb [signed-by=/usr/share/postgresql-common/pgdg/apt.postgresql.org.asc] https://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list

RUN apt-get update && apt-get install -y postgresql-client-16

RUN apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY script.sh .

RUN chmod +x script.sh

ENTRYPOINT ["./script.sh"]
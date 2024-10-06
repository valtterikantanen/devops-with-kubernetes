#!/bin/sh

BACKUP_PATH="/tmp/backup-$(date +\%Y-\%m-\%d).sql"

PGPASSWORD=$POSTGRES_PASSWORD pg_dump --host=postgres-svc --username=postgres --file=$BACKUP_PATH --format=custom

gsutil cp $BACKUP_PATH gs://todo-app-db-backup

rm $BACKUP_PATH
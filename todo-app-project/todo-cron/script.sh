#!/bin/sh

get_random_article_url() {
  response=$(curl -s -I "https://en.wikipedia.org/wiki/Special:Random")
  location=$(echo "$response" | grep -i "location" | awk '{print $2}' | tr -d '\r')
  echo "$location"
}

while true; do
  url=$(get_random_article_url)

  # Backend API has a limit of 140 characters for the task field (including the "Read " prefix)
  if [ ${#url} -le 135 ]; then
    break
  fi
done

json_payload=$(printf '{"task": "Read %s"}' "$url")

curl -X POST "http://todo-app-backend-svc:80/todos" \
  -H "Content-Type: application/json" \
  -d "$json_payload"
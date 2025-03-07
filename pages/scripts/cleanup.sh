#!/bin/bash

echo "Running cleanup..."
redis-cli --raw KEYS "message:*" | while read key; do
  if [[ $(redis-cli TTL "$key") -eq -1 ]]; then
    redis-cli DEL "$key"
    echo "🗑️ Deleted expired message: $key"
  fi
done

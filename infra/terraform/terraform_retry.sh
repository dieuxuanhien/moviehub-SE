#!/bin/bash
# Retry terraform plan with exponential backoff
export ARM_SKIP_PROVIDER_REGISTRATION=true

for i in {1..5}; do
  echo "Attempt $i of 5..."
  if terraform plan --out=tfplan -refresh=false; then
    echo "Success!"
    exit 0
  fi
  sleep $((2**i))
done

echo "Failed after 5 attempts. Check your network connection."
exit 1

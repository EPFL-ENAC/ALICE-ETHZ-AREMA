#!/bin/bash

# the goal of this script is to inject environment variables into the frontend
# by creating a javascript file that will be injected in the boot file
WWW_DIR=/app
ENV_PATH="${WWW_DIR}/env.js"
# Create the file
echo -n "window.env = {" > "${ENV_PATH}"
COMMA=""
for envrow in $(printenv); do
  IFS='=' read -r key value <<< "${envrow}"
  case "${key}" in
    "API_URL" | "API_PATH")
      echo -n "${COMMA}" >> "${ENV_PATH}"
      echo -n "${key}: '${value}'" >> "${ENV_PATH}"
      COMMA=","
      ;;
    *)
      # ignore the key
      ;;
  esac
done
echo "};" >> "${ENV_PATH}"

# execute the web server
nginx -g 'daemon off;'
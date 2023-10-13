#!/bin/sh
set -e

if [ -z "${1}" ]; then
  exec dumb-init node --experimental-modules build
elif ! [ -z "$(command -v "${1}")" ]; then
  exec "$@"
else
  exec dumb-init node --experimental-modules "$@"
fi
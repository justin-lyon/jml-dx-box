#!/bin/bash

# create org
echo "...Creating new Scratch Org $1"
sf org create scratch --set-default \
  --alias $1 \
  --definition-file config/project-scratch-def.json
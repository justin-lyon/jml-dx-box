#!/bin/bash

# create org
echo "...Creating new Scratch Org $1"
sfdx force:org:create -sa $1 -f config/project-scratch-def.json

# echo "...Install Open CTI Lightning Demo Adapter"
# sfdx force:package:install --package OpenCTIDemo

# push mdt
echo "...Pushing metadata to $1"
sfdx force:source:push

# assign permset
bash ./scripts/assign-perms.sh

# load data
bash ./scripts/add-data.sh
#!/bin/bash

# create org
echo "...Creating new Scratch Org $1"
sfdx force:org:create -sa $1 -f config/project-scratch-def.json

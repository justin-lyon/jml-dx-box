#!/bin/bash

# create org
echo "...Creating new Scratch Org $1"
sfdx force:org:create -sa $1 -f config/project-scratch-def.json

# push mdt
echo "...Pushing metadata to $1"
sfdx force:source:push

# assign permset
echo "...Assigning Permission Set LWCDemoApp"
sfdx force:user:permset:assign -n LWCDemoApp

# load data
echo "...Importing data/Account-Contact-plan.json"
sfdx force:data:tree:import -p data/Account-Contact-plan.json
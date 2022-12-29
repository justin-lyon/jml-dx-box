#!/bin/bash

# create org
echo "...Creating new Scratch Org $1"
sfdx force:org:create -sa $1 -f config/project-scratch-def.json

# echo "...Install Open CTI Lightning Demo Adapter"
# sfdx force:package:install --package OpenCTIDemo

# push mdt
echo "...Pushing metadata to $1"
sfdx force:source:push

# assign permsets
echo "...Assigning Permission Set LWCDemoApp, ConsoleNav, & AlertsManager"
sfdx force:user:permset:assign -n "LWCDemoApp, ConsoleNav, AlertsManager"

# load data
echo "...Importing data/Account-Contact-Case-plan.json"
sfdx force:data:tree:import -p data/Account-Contact-Case-plan.json

echo "...Importing data/Alert__c-plan.json"
sfdx force:data:tree:import -p data/Alert__c-plan.json
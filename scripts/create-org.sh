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

echo "...Assigning Permission Set ConsoleNav"
sfdx force:user:permset:assign -n ConsoleNav

echo "...Assigning Permission Set AlertsManager"
sfdx force:user:permset:assign -n AlertsManager

# load data
echo "...Importing data/Account-Contact-Case-plan.json"
sfdx force:data:tree:import -p data/Account-Contact-Case-plan.json

echo "...Importing data/Alert__c-plan.json"
sfdx force:data:tree:import -p data/Alert__c-plan.json
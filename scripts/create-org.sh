#!/bin/bash

set -e

# create org
echo "...Creating new Scratch Org $1"
sf org create scratch \
  --set-default \
  --alias $1 \
  --definition-file config/project-scratch-def.json

# push mdt
echo "...Pushing metadata to $1"
sf project deploy start \
  --source-dir force-app

# assign permsets
echo "...Assigning Permission Set LWCDemoApp, ConsoleNav, & AlertsManager"
sf org assign permset \
  --name LWCDemoApp \
  --name ConsoleNav \
  --name AlertsManager

# load data
echo "...Importing data/Account-Contact-Case-plan.json"
sf data import tree \
  --plan data/Account-Contact-Case-plan.json

echo "...Importing data/Alert__c-plan.json"
sf data import tree \
  --plan data/Alert__c-plan.json

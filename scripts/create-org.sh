#!/bin/bash

set -e

# create org
echo "...Creating new Scratch Org $1"
sf org create scratch \
  --set-default \
  --alias $1 \
  --definition-file config/project-scratch-def.json

# install nebula logger
sf package install --wait 30 \
  --security-type AdminsOnly \
  --no-prompt \
  --package 04t5Y0000015pGtQAI

# push mdt
echo "...Pushing metadata to $1"
sf project deploy start \
  --source-dir force-app \
  --source-dir examples

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

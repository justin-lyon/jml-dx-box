#!/bin/bash

set -e

# create org
echo "...Creating new Scratch Org $1"
sf org create scratch \
  --set-default \
  --alias $1 \
  --definition-file config/project-scratch-def.json

# install nebula logger
echo "...Installing Nebula Logger"
sf package install --wait 30 \
  --security-type AdminsOnly \
  --no-prompt \
  --package 04t5Y0000015pGtQAI

# install lwc-utils - core
echo "...Installing LWC Utils Core"
sf package install --wait 30 \
  --security-type AdminsOnly \
  --no-prompt \
  --package 04t1Q000001ACZsQAO

# push mdt
echo "...Pushing metadata to $1"
sf project deploy start \
  --source-dir force-app \
  --source-dir examples

# assign permsets
echo "...Assigning Permission Set LWCDemoApp, ConsoleNav, & AlertsManager"
sf org assign permset \
  --name Admin \
  --name LWCDemoApp

# load data
echo "...Importing data/Account-Contact-Case-plan.json"
sf data import tree \
  --plan data/Account-Contact-Case-plan.json

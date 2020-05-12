#!/bin/bash

# load data
echo "...Importing data/Account-Contact-Case-plan.json"
sfdx force:data:tree:import -p data/Account-Contact-Case-plan.json

echo "...Importing data/Alert__c-plan.json"
sfdx force:data:tree:import -p data/Alert__c-plan.json
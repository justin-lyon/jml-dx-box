#!/bin/bash

echo "...Assigning Permission Set LWCDemoApp"
sfdx force:user:permset:assign -n LWCDemoApp

echo "...Assigning Permission Set ConsoleNav"
sfdx force:user:permset:assign -n ConsoleNav

echo "...Assigning Permission Set AlertsManager"
sfdx force:user:permset:assign -n AlertsManager

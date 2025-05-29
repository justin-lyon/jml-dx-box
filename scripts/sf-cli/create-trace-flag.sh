#!/bin/bash
# Assumptions:
# * You are running this command in a workspace that is authorized to a default org
# * You have one user authorized to this default org
# * You have a DebugLevel with DeveloperName="ALL_FINEST" in the default org

NOW=$(date +%Y-%m-%dT%H:%M:%S%z)
# date - Linux Only
# EXP=$(date -d '+1 hour' +%Y-%m-%dT%H:%M:%S%z)
# date - Mac OS Only
EXP=$(date -v+1H +%Y-%m-%dT%H:%M:%S%z)

# Get your own UserId based on default org
TRACED_ENTITY_ID=$(sf org list users --json | jq -r '.result[0].userId')

# Get the DebugLevel by DeveloperName=ALL_FINEST
DEBUG_LEVEL_ID=$(sf data get record --sobject DebugLevel --where "DeveloperName=ALL_FINEST" --use-tooling-api --json | jq -r '.result.Id')

sf data create record \
--sobject TraceFlag \
-v "StartDate=$NOW ExpirationDate=$EXP TracedEntityId=$TRACED_ENTITY_ID LogType=USER_DEBUG DebugLevelId=$DEBUG_LEVEL_ID" \
--use-tooling-api

#!/bin/bash
# Assumptions:
# * You are running this command in a workspace that is authorized to a default org
# * You have one user authorized to this default org
# * A TraceFlag currently exists for your user in this default org.
# * You have a DebugLevel with DeveloperName="ALL_FINEST" in the default org

NOW=$(date +%Y-%m-%dT%H:%M:%S%z)
# date - Linux Only
# EXP=$(date -d '+1 hour' +%Y-%m-%dT%H:%M:%S%z)
# date - Mac OS Only
EXP=$(date -v+1H +%Y-%m-%dT%H:%M:%S%z)

CURRENT_USER_ID=$(sf org list users --json | jq -r '.result[0].userId')
echo "CURRENT_USER_ID: $CURRENT_USER_ID"

# Get an existing TraceFlag for your user.
TRACE_FLAG_ID=$(sf data get record --sobject TraceFlag --where "TracedEntityId=$CURRENT_USER_ID" --use-tooling-api --json | jq -r '.result.Id')
echo "TRACE_FLAG_ID: $TRACE_FLAG_ID"

# Get the DebugLevel by DeveloperName=ALL_FINEST
DEBUG_LEVEL_ID=$(sf data get record --sobject DebugLevel --where "DeveloperName=ALL_FINEST" --use-tooling-api --json | jq -r '.result.Id')
echo "DEBUG_LEVEL_ID: $DEBUG_LEVEL_ID"

sf data update record \
--sobject TraceFlag \
--record-id $TRACE_FLAG_ID \
-v "StartDate=$NOW ExpirationDate=$EXP DebugLevelId=$DEBUG_LEVEL_ID" \
--use-tooling-api

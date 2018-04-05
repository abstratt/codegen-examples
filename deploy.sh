#!/bin/bash
set -e
set -o pipefail

CLOUDFIER_URL=${CLOUDFIER_URL:-http://develop.cloudfier.com}

if [ "$#" -lt 1 ] ; then
    echo 'Parameter APPLICATION is required'
    exit 1
fi

APPLICATION=$1
CLOUDFIER_USER=${2:-test}
BASE_APPLICATION_PATH=${3:-/cloudfier-examples/}

./deploy-app.sh $APPLICATION $CLOUDFIER_USER $BASE_APPLICATION_PATH
./deploy-db.sh $APPLICATION $CLOUDFIER_USER $BASE_APPLICATION_PATH
./deploy-test.sh $APPLICATION $CLOUDFIER_USER $BASE_APPLICATION_PATH
./deploy-db.sh $APPLICATION $CLOUDFIER_USER $BASE_APPLICATION_PATH

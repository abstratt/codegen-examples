#!/bin/bash
CLOUDFIER_URL=${CLOUDFIER_URL:-http://develop.cloudfier.com}

if [ "$#" -lt 1 ] ; then
    echo 'Parameter APPLICATION is required'
    exit 1
fi

APPLICATION=$1
CLOUDFIER_USER=${2:-test}
BASE_APPLICATION_PATH=${3:-/cloudfier-examples/}

echo
echo 
echo "*** Compiling the application $APPLICATION"
curl -X POST $CLOUDFIER_URL/services/deployer/?path=$CLOUDFIER_USER${BASE_APPLICATION_PATH}$APPLICATION
